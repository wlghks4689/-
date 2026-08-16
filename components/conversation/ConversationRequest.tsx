import { ConversationHints } from "./ConversationHints";

export function ConversationRequest({ sharedTopics, fallback, onBack, onSubmit }: { sharedTopics:string[];fallback:string;onBack:()=>void;onSubmit:()=>void }) {
  return <div className="auth-card request-card"><button className="back" onClick={onBack}>← 프로필로</button><div className="step-label">무료 대화 요청</div><h2>무슨 말을 할지 고민된다면</h2><ConversationHints sharedTopics={sharedTopics} fallback={fallback}/><label>첫 인사<textarea placeholder="프로필을 보고 궁금했던 점을 정중하게 적어보세요."/></label><p className="free-note">대화 요청 단계에서는 활성 채팅 슬롯을 사용하지 않아요.</p><button className="primary" onClick={onSubmit}>무료로 대화 요청 보내기<span>→</span></button></div>;
}
