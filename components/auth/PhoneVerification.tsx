"use client";
import { FormEvent, useState } from "react";
import { isValidKoreanMobile } from "../../lib/profile-utils";

export function PhoneVerification({ onBack, onVerified }: { onBack:()=>void; onVerified:()=>void }) {
  const [phone,setPhone]=useState(""); const [code,setCode]=useState(""); const [sent,setSent]=useState(false); const [error,setError]=useState("");
  function requestCode(){if(!isValidKoreanMobile(phone)){setError("휴대전화 번호를 정확히 입력해 주세요.");return}setSent(true);setError("")}
  function submit(e:FormEvent){e.preventDefault();if(code!=="123456"){setError("데모 인증번호 123456을 입력해 주세요.");return}onVerified()}
  return <div className="auth-card"><button className="back" onClick={onBack}>← 이전</button><div className="step-label">02 · 휴대전화 인증</div><h2>한 사람, 하나의 계정</h2><p className="subcopy">안전한 만남을 위해 본인 확인이 필요해요.</p><form onSubmit={submit}><label>휴대전화 번호<div className="inline-input"><input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="01012345678"/><button type="button" onClick={requestCode}>인증번호 받기</button></div></label>{sent&&<label>인증번호<input value={code} onChange={e=>setCode(e.target.value)} maxLength={6} placeholder="데모 번호 123456"/></label>}{error&&<p className="error">{error}</p>}<button className="primary" disabled={!sent}>인증하고 프로필 만들기<span>→</span></button></form></div>;
}
