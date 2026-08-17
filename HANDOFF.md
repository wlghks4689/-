# 잘되면 밥한끼 — 프로젝트 인수인계

작성 기준: 2026-08-17 현재 저장소 코드. 기획만 있고 코드에 없는 기능은 구현으로 표기하지 않는다.

## 1. 현재 구현 완료된 기능

- 모바일 우선 단일 페이지 앱 셸과 하단 탭: 홈, 대화, 피드, 내 프로필
- Kakao/Google 로그인, 휴대전화 인증, 사진 심사의 로컬 데모 흐름
- 사진 필수 기본 프로필과 20세 이상만 표시되는 출생연도 선택
- 6단계 프로필 성향 작성과 브라우저 저장
- 반대 성별 데모 프로필 추천과 양방향 탐색, 동일 크기 PROFILE CARD/PROFILE NOTE 뒤집기
- 대화 배지 설명 바텀시트와 실제 후보 기반 공통 주제 힌트
- 보낸/받은/활성 대화 상태, 작성한 첫 인사 보존, 요청 수락, 대화 종료, 무료 슬롯 제한 목업
- 프로필 카드 테마 선택과 캔버스 서명 저장

## 2. 아직 목업이거나 미구현인 기능

- 목업: OAuth, SMS 인증번호 `123456`, 사진 자동 승인, 추천 프로필, 요청/채팅 상태, 슬롯 상점
- 미구현: Supabase 데이터 영속화, 실제 얼굴 심사, 실시간 메시지 채팅방, 결제, 신고/차단/관리자, 알림, 광고, Apple 로그인/Account Linking
- 피드는 준비 중 안내 화면만 있다.

## 3. 현재 화면/페이지 구조

실제 URL 라우트는 `/` 하나이며 `app/page.tsx` 상태로 인증 → 휴대전화 → 기본 프로필 → 성향 작성 → 앱 셸을 전환한다. 앱 셸은 홈/대화/피드/내 프로필 탭이며 설정은 내 프로필 안에 있다.

## 4. 주요 컴포넌트와 역할

- `app/page.tsx`: 인증·온보딩·앱 진입과 저장 조정
- `components/app/MobileAppShell.tsx`: 하단 탭, 요청/채팅의 상위 로컬 상태
- `components/home/HomeScreen.tsx`: 후보 정렬·이전/다음 카드·요청 진입. 홈 필터와 추천 이유 UI는 노출하지 않음
- `components/home/ProfileCard.tsx`: PROFILE CARD/PROFILE NOTE, Adaptive Pill, 앞/뒤 전환, 테마, 배지 설명
- `public/assets/meal-card-logo.svg`: 카드 양면이 공유하는 공식 카드 로고 에셋
- `components/home/RecommendationReason.tsx`: 공통 주제와 추구미 추천 근거
- `components/chat/ChatHub.tsx`: 활성/받은/보낸 탭, 슬롯 사용량 표시, 2개 슬롯, 종료·안내 모달
- `components/feed/FeedPlaceholder.tsx`: 피드 준비 화면
- `components/profile/MyProfile.tsx`: 내 카드, 테마, 서명, 설정/로그아웃
- `components/profile/ProfileSignature.tsx`: 포인터 기반 서명 캔버스
- `components/profile/BasicProfileForm.tsx`, `ProfileTraitsWizard.tsx`: 프로필 입력
- `components/conversation/ConversationRequest.tsx`: 선택한 상대에게 보내는 요청 UI
- `data/demo-profiles.ts`: 성별별 데모 프로필 10명과 추구미 점수 함수
- `lib/profile-storage.ts`, `lib/profile-utils.ts`: 로컬 저장과 검증/공통 주제

## 5. 현재 데이터 구조

`Profile`은 이름, 출생연도 호환값(`birthDate`에 `YYYY-01-01` 저장), 성별, 지역, 직업, 소개, 사진 Data URL, MBTI, 키, 흡연, 자기 외형 특징, 서명, 카드 테마와 `basic/lifestyle/dating/topics/attraction/badges` 태그 배열을 가진다. 카드 테마는 coral/crimson/cream/sage/navy/lavender/mono 7종이다. `PublicProfile`은 여기에 데모 ID와 인증 여부를 더한다. 계정은 `meal-demo-account` 키로 `localStorage`에 저장된다.

`attraction`은 화면에서 `🎯 추구미 키워드`로 표시하며 최대 1개다. 개인 추천 입력이므로 타인의 공개 카드에는 표시하지 않는다.

## 6. Supabase 테이블 및 연동 상태

- `@supabase/supabase-js`와 조건부 클라이언트 팩토리만 준비됨
- 환경변수 이름: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- 실제 프로젝트/Auth/Postgres/Storage/Realtime, migration, RLS는 모두 미연결
- 설계 초안은 `docs/supabase-schema.md`, `docs/profile-system.md`에 있음

## 7. 로그인/프로필/대화요청/채팅 구현 상태

- 로그인·휴대전화·사진 심사: 로컬 목업
- 프로필: 로컬 작성·수정·저장 가능
- 대화 요청: 선택 후보와 사용자가 작성한 첫 인사를 보낸 요청 목록에 추가하는 로컬 상태
- 요청 수락: 활성 대화로 이동하며 무료 슬롯을 사용
- 채팅: 활성 상대 목록까지만 구현. 메시지 화면/저장/Realtime은 미구현

## 8. 프로필 태그 및 대화 성향 배지 구현 상태

- 일반 성향/라이프스타일/연애 스타일/대화 주제와 직접 입력 지원
- 화면 명칭은 `연애 스타일`이며 내부 호환 키는 `dating`을 유지
- 직접 입력 키워드는 별도 영역에 즉시 표시되고 선택 개수/최대 개수는 옵션 목록 아래에 표시
- 추구미 키워드는 성별별 구조화 후보 중 최대 1개
- 대화 배지는 최대 3개이며 공개 카드에서 누르면 설명 바텀시트 표시
- 추구미는 추천 점수에만 쓰고 카드에 노출하지 않음
- 카드 앞면은 출생연도와 최대 3개 관심사를 표시하며, 뒷면은 주제 최대 5개와 성향 태그를 가변 pill로 표시
- 뒷면 중앙 콘텐츠만 세로 스크롤되며, 뒷면에서는 하단 `앞면 보기` 버튼으로만 되돌아감

## 9. 활성 채팅 슬롯 BM 구현 상태

- 클라이언트 목업으로 무료 활성 슬롯 2개
- 요청을 보내거나 받은 상태는 슬롯을 차지하지 않음
- 세 번째 요청 수락 시 슬롯 부족 모달과 목업 상점 표시
- 활성 대화 종료 확인 후 슬롯 반환
- 결제·서버 검증·구매 영속화는 미구현

## 10. 개발자 밥 사주기 기능 구현 상태

브랜드 문구 외 화면, 결제, 후원 기록은 미구현이다.

## 11. 최근 수정한 주요 파일

`app/globals.css`, `components/home/ProfileCard.tsx`, `components/profile/MyProfile.tsx`, `public/assets/meal-card-logo.svg`, `types/profile.ts`, `HANDOFF.md`.

## 12. 현재 알고 있는 버그/문제

- 인증·심사·추천·슬롯은 브라우저 상태이므로 보안 기능이 아니다.
- 개인정보와 사진 Data URL이 localStorage에 평문 저장된다.
- 새로고침 시 앱 셸의 요청/활성 대화 상태는 사라진다.
- 보낸 요청의 `수락 상태 보기`는 서버가 없는 데모에서 수락 후 활성 대화 전환을 확인하기 위한 로컬 동작이다.
- 데모 인물 사진은 외부 `i.pravatar.cc` URL이라 네트워크에 의존한다.
- 첫 추천 여성 프로필은 프로젝트 로컬 생성 이미지 `public/assets/demo-profile-minji.png`를 사용한다. 나머지 데모 인물은 외부 `i.pravatar.cc` URL에 의존한다.
- 실제 메시지 채팅방이 없고 피드는 플레이스홀더다.
- MBTI 입력 UI가 없어 기존 프로필에서는 비어 있을 수 있다.
- 실제 모바일 기기·스크린리더·다중 브라우저 QA는 아직 제한적이다.
- 카드의 SVG 로고와 프로필/서명 이미지는 일반 `img`를 사용해 ESLint 이미지 최적화 경고가 남아 있다.

## 13. 다음 작업 후보

1. 실제 모바일 브라우저 시각/터치 QA와 접근성 보완
2. Supabase Auth·profiles·photos·requests·rooms·messages 스키마/RLS 연결
3. 요청과 활성 대화 상태 영속화, Realtime 메시지 화면 구현
4. 실제 본인확인·얼굴 심사·신고/차단·관리자 도구
5. 슬롯 상품 및 개발자 밥 사주기 결제 정책 결정
6. 광고 위치·빈도·개인정보 정책을 정한 뒤 광고 UI/SDK 구현

## 14. 프로젝트 실행 방법

Node.js 22.13.0 이상에서 `npm install`, `npm run dev`를 실행한다. 검증은 `npm run build`, `npm test`, `npm run lint`다. 현재 필수 사용자 환경변수는 없으며 Supabase 연결 시 위 두 환경변수만 클라이언트에 사용한다. 비밀번호, API Secret, `service_role` 키는 클라이언트나 문서에 기록하지 않는다.

## 15. 사용 중인 주요 라이브러리와 기술 스택

React 19, TypeScript 5.9, Vinext, Vite 8, 일반 CSS/Tailwind CSS 4 기반, Supabase JS(준비만), Drizzle(제품 DB 미사용), ESLint, Node test runner, localStorage, OpenAI Sites 배포 설정.
