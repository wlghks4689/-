"use client";
import { useState } from "react";
import { ConversationHints } from "./ConversationHints";

export function ConversationRequest({candidateName,sharedTopics,fallback,onBack,onSubmit}:{candidateName:string;sharedTopics:string[];fallback:string;onBack:()=>void;onSubmit:(message:string)=>void}){
 const [message,setMessage]=useState("");const trimmed=message.trim();
 return <div className="auth-card request-card"><button className="back" onClick={onBack}>← {candidateName}님의 카드로</button><div className="step-label">무료 대화 요청</div><h2>첫마디만 건네볼까요?</h2><p className="subcopy">잘 보이려는 말보다, 정말 궁금했던 한 가지면 충분해요.</p><ConversationHints sharedTopics={sharedTopics} fallback={fallback}/><label>첫 인사<textarea value={message} maxLength={180} onChange={e=>setMessage(e.target.value)} placeholder="예: 일본 소도시 여행 중 가장 기억에 남은 곳이 궁금해요."/></label><small className="request-counter">{message.length} / 180</small><p className="free-note">요청은 무료이고, 상대가 수락하기 전에는 대화 공간을 쓰지 않아요.</p><button className="primary" disabled={!trimmed} onClick={()=>onSubmit(trimmed)}>이 인사로 대화 신청하기<span>→</span></button></div>
}
