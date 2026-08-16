import { Provider } from "../../types/profile";

export function SocialLogin({ onLogin }: { onLogin: (provider: Provider) => void }) {
  return <div className="auth-card"><div className="step-label">01 · 간편하게 시작하기</div><h2>부담 없이 만나보세요</h2><p className="subcopy">SNS 계정은 빠른 가입을 위해서만 사용해요.</p><div className="social-buttons"><button className="social kakao" onClick={()=>onLogin("kakao")}><b>Talk</b><span>카카오로 계속하기</span></button><button className="social google" onClick={()=>onLogin("google")}><b>G</b><span>Google로 계속하기</span></button></div><div className="trust-note"><span>✓</span><p><b>실제 사용자 확인은 따로 해요.</b><br/>탐색과 대화 전에 휴대전화 인증이 필요합니다.</p></div></div>;
}
