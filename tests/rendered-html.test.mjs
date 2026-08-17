import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

async function loadUtilities() {
  const source = await readFile(new URL("../lib/profile-utils.ts", import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(js).toString("base64")}`);
}

test("renders the product login surface", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /잘되면 밥한끼/);
  assert.match(html, /카카오로 계속하기/);
  assert.match(html, /Google로 계속하기/);
});

test("profile utilities validate core rules", async () => {
  const utils = await loadUtilities();
  assert.deepEqual(utils.getSharedTopics(["게임", "AI", "여행"], ["영화", "게임", "여행"]), ["게임", "여행"]);
  assert.equal(utils.isValidKoreanMobile("010-1234-5678"), true);
  assert.match(utils.validateCustomTag("https://example.com"), /URL/);
  assert.match(utils.validateCustomTag("010-1234-5678"), /연락처/);
  assert.equal(utils.getFullAge("2000-08-17", new Date("2026-08-16T12:00:00")), 25);
});

test("page delegates UI and storage responsibilities", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(page, /<SocialLogin/);
  assert.match(page, /<ProfileTraitsWizard/);
  assert.match(page, /clearAccount\(\)/);
  assert.doesNotMatch(page, /localStorage/);
});

test("profile card keeps the final front and back interaction contract", async () => {
  const card = await readFile(new URL("../components/home/ProfileCard.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(card, /PROFILE CARD/);
  assert.match(card, /PROFILE NOTE/);
  assert.match(card, /YEAR OF BIRTH/);
  assert.match(card, /앞면 보기/);
  assert.doesNotMatch(card, /NO\./);
  assert.match(css, /height:clamp\(680px,180vw,760px\)/);
  assert.match(css, /overflow-y:auto;overflow-x:hidden/);
  assert.match(css, /\.adaptive-pill/);
});

test("home focuses on bidirectional card discovery", async () => {
  const home = await readFile(new URL("../components/home/HomeScreen.tsx", import.meta.url), "utf8");
  assert.match(home, /이전 카드 보기/);
  assert.match(home, /다음 카드 보기/);
  assert.doesNotMatch(home, /filter-row/);
  assert.doesNotMatch(home, /RecommendationReason/);
  assert.doesNotMatch(home, /왜 이 카드가 보여요/);
});

test("conversation request preserves the written first message", async () => {
  const request = await readFile(new URL("../components/conversation/ConversationRequest.tsx", import.meta.url), "utf8");
  const shell = await readFile(new URL("../components/app/MobileAppShell.tsx", import.meta.url), "utf8");
  const chat = await readFile(new URL("../components/chat/ChatHub.tsx", import.meta.url), "utf8");
  assert.match(request, /onSubmit\(trimmed\)/);
  assert.ok(request.includes("maxLength={180}"));
  assert.match(shell, /message}\]\);setCandidate/);
  assert.doesNotMatch(chat, /Mock 수락/);
  assert.match(chat, /내 대화 공간/);
});

test("profile creation exposes adult birth years and custom selections", async () => {
  const basic = await readFile(new URL("../components/profile/BasicProfileForm.tsx", import.meta.url), "utf8");
  const traits = await readFile(new URL("../components/profile/ProfileTraitsWizard.tsx", import.meta.url), "utf8");
  const card = await readFile(new URL("../components/home/ProfileCard.tsx", import.meta.url), "utf8");
  assert.match(basic, /getFullYear\(\)-20/);
  assert.match(basic, /출생연도/);
  assert.doesNotMatch(basic, /type="date"/);
  assert.match(traits, /내가 직접 추가한 키워드/);
  assert.match(traits, /현재 {selected.length}개 선택/);
  assert.match(traits, /연애 스타일/);
  assert.match(card, /CardIcon/);
});
