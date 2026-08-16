"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Profile = { name: string; birthYear: string; region: string; job: string; intro: string; photo: string };
const emptyProfile: Profile = { name: "", birthYear: "", region: "", job: "", intro: "", photo: "" };

export default function Home() {
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [screen, setScreen] = useState<"auth" | "edit" | "profile">("auth");
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("sai-demo-profile");
    if (saved) { setProfile(JSON.parse(saved)); setScreen("profile"); }
  }, []);

  function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!data.get("email") || String(data.get("password")).length < 8) { setError("이메일과 8자 이상의 비밀번호를 확인해 주세요."); return; }
    setError(""); setScreen(profile.name ? "profile" : "edit");
  }
  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile.name || !profile.birthYear || !profile.region || !profile.intro) { setError("필수 항목을 모두 채워 주세요."); return; }
    localStorage.setItem("sai-demo-profile", JSON.stringify(profile)); setError(""); setScreen("profile");
  }
  function uploadPhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setError("사진은 3MB 이하로 선택해 주세요."); return; }
    const reader = new FileReader(); reader.onload = () => setProfile({ ...profile, photo: String(reader.result) }); reader.readAsDataURL(file);
  }
  function logout() { setScreen("auth"); setMode("login"); setError(""); }

  return (
    <main className="app-shell">
      <section className="brand-panel">
        <div className="brand-mark">사이</div>
        <div className="hero-copy"><span className="eyebrow">대화에서 시작되는 인연</span><h1>마음이 오가는 데<br />가격표는 필요 없으니까.</h1><p>프로필도, 관심 표현도, 첫 대화도 무료예요.<br />천천히 알아가고 솔직하게 이어가세요.</p></div>
        <div className="promise-list"><span>무료 프로필 열람</span><span>무료 대화 요청</span><span>무료 기본 채팅</span></div>
      </section>
      <section className="auth-panel">
        <div className="mobile-brand"><b>사이</b><span>대화에서 시작되는 인연</span></div>
        {screen === "auth" && <div className="auth-card">
          <div className="step-label">01 · 시작하기</div><h2>{mode === "signup" ? "새로운 인연을 만나볼까요?" : "다시 만나 반가워요"}</h2><p className="subcopy">안전한 만남을 위해 이메일로 시작해요.</p>
          <div className="mode-tabs"><button className={mode === "signup" ? "active" : ""} onClick={() => {setMode("signup");setError("")}}>회원가입</button><button className={mode === "login" ? "active" : ""} onClick={() => {setMode("login");setError("")}}>로그인</button></div>
          <form onSubmit={authenticate}><label>이메일<input name="email" type="email" placeholder="hello@example.com" autoComplete="email" /></label><label>비밀번호<input name="password" type="password" placeholder="8자 이상 입력해 주세요" autoComplete={mode === "signup" ? "new-password" : "current-password"} /></label>{mode === "signup" && <label className="consent"><input required type="checkbox" /><span>만 18세 이상이며, 이용약관과 개인정보 처리방침에 동의합니다.</span></label>}{error && <p className="error">{error}</p>}<button className="primary" type="submit">{mode === "signup" ? "무료로 시작하기" : "로그인"}<span>→</span></button></form>
          <div className="trust-note"><span>✓</span><p><b>핵심 대화 기능은 무료예요.</b><br />결제 여부가 추천이나 매칭 확률에 영향을 주지 않아요.</p></div>
        </div>}
        {screen === "edit" && <div className="auth-card profile-form"><div className="step-label">02 · 프로필 만들기</div><h2>{profile.name ? "프로필을 다듬어 볼까요?" : "당신을 조금 알려주세요"}</h2><p className="subcopy">나중에 언제든 수정할 수 있어요.</p>
          <form onSubmit={saveProfile}><div className="photo-row"><label className="photo-upload">{profile.photo ? <img src={profile.photo} alt="프로필 미리보기" /> : <span>＋<small>사진 추가</small></span>}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadPhoto} /></label><p>얼굴이 잘 보이는 사진 1장<br /><small>JPG, PNG, WEBP · 최대 3MB</small></p></div>
            <div className="two-col"><label>닉네임 *<input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})} placeholder="예: 봄날" /></label><label>출생연도 *<input value={profile.birthYear} onChange={e=>setProfile({...profile,birthYear:e.target.value})} inputMode="numeric" placeholder="1995" /></label></div>
            <label>활동 지역 *<select value={profile.region} onChange={e=>setProfile({...profile,region:e.target.value})}><option value="">선택해 주세요</option><option>서울</option><option>경기</option><option>인천</option><option>부산</option><option>대전</option><option>대구</option><option>광주</option><option>제주</option></select></label>
            <label>하는 일<input value={profile.job} onChange={e=>setProfile({...profile,job:e.target.value})} placeholder="예: 브랜드 디자이너" /></label><label>한 줄 소개 *<textarea maxLength={120} value={profile.intro} onChange={e=>setProfile({...profile,intro:e.target.value})} placeholder="좋아하는 것과 요즘 관심사를 들려주세요." /><small className="counter">{profile.intro.length}/120</small></label>{error && <p className="error">{error}</p>}<button className="primary" type="submit">프로필 저장하기<span>→</span></button></form>
        </div>}
        {screen === "profile" && <div className="auth-card"><div className="profile-top"><div><div className="step-label">내 프로필</div><h2>반가워요, {profile.name}님</h2></div><button className="text-button" onClick={logout}>로그아웃</button></div><p className="subcopy">이 프로필로 새로운 인연을 만날 준비가 됐어요.</p>
          <article className="profile-preview"><div className="profile-photo">{profile.photo ? <img src={profile.photo} alt={`${profile.name}의 프로필`} /> : <span>{profile.name.slice(0,1)}</span>}</div><div className="profile-info"><h3>{profile.name} <small>{new Date().getFullYear() - Number(profile.birthYear) + 1}</small></h3><p>{profile.region}{profile.job && ` · ${profile.job}`}</p><blockquote>{profile.intro}</blockquote></div></article>
          <button className="primary" onClick={()=>setScreen("edit")}>프로필 수정하기<span>✎</span></button><div className="next-note"><b>다음 단계에서 열려요</b><span>프로필 탐색 · 무료 대화 요청 · 채팅</span></div>
        </div>}
        <p className="legal">프로토타입 데모 · 정보는 이 기기에만 저장됩니다.</p>
      </section>
    </main>
  );
}
