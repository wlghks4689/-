"use client";
import { useState } from "react";
import { PROFILE_TAGS, TALK_BADGES } from "../../app/profile-tags";
import { validateCustomTag } from "../../lib/profile-utils";
import { Profile, ProfileTagKey } from "../../types/profile";

export const TRAIT_STEPS=[
  {key:"basic" as ProfileTagKey,icon:"🧩",title:"기본 성향",lead:"나는 대체로 이런 사람이에요.",help:"나를 잘 설명하는 키워드를 골라주세요.",custom:true},
  {key:"lifestyle" as ProfileTagKey,icon:"🏠",title:"라이프스타일",lead:"평소에는 이렇게 살아요.",help:"함께 시간을 보낼 때 중요한 생활 스타일이에요.",custom:true},
  {key:"dating" as ProfileTagKey,icon:"❤️",title:"연애 타입",lead:"연애하면 저는 이런 편이에요.",help:"좋고 나쁨보다 서로 잘 맞는지가 중요해요.",custom:true},
  {key:"topics" as ProfileTagKey,icon:"💬",title:"이 얘기라면 오래 할 수 있어요",lead:"당신이 좋아하는 이야기를 알려주세요.",help:"흔한 취미도, 아무도 모르는 마이너 취향도 좋아요.",custom:true},
  {key:"attraction" as ProfileTagKey,icon:"💘",title:"이런 분위기에 끌려요",lead:"이런 매력에 마음이 가요.",help:"상대에게 기대하는 분위기를 골라주세요.",custom:false},
  {key:"badges" as ProfileTagKey,icon:"🗣️",title:"나와 대화하면 이런 느낌이에요",lead:"대화 스타일을 딱 3개만 골라주세요.",help:"처음 말을 걸 때 도움이 되는 배지예요.",custom:false},
];

export function ProfileTraitsWizard({ profile, step, onStep, onProfile, onBackToBasic, onComplete }: { profile:Profile;step:number;onStep:(n:number)=>void;onProfile:(p:Profile)=>void;onBackToBasic:()=>void;onComplete:()=>void }) {
  const [custom,setCustom]=useState("");const [error,setError]=useState("");const current=TRAIT_STEPS[step];const limit=current.key==="badges"?3:5;const selected=profile.tags[current.key];
  const options=current.key==="badges"?TALK_BADGES.map(x=>x[0]):current.key==="attraction"?(profile.gender==="male"?PROFILE_TAGS.attractionForWomen:PROFILE_TAGS.attractionForMen):PROFILE_TAGS[current.key as keyof typeof PROFILE_TAGS] as readonly string[];
  function toggle(tag:string){const next=selected.includes(tag)?selected.filter(x=>x!==tag):selected.length<limit?[...selected,tag]:selected;onProfile({...profile,tags:{...profile.tags,[current.key]:next}});setError(!selected.includes(tag)&&selected.length>=limit?`최대 ${limit}개까지 선택할 수 있어요.`:"")}
  function addCustom(){const value=custom.trim(),validation=validateCustomTag(value);if(validation){setError(validation);return}if(selected.length>=5){setError("최대 5개까지 선택할 수 있어요.");return}if(!selected.includes(value))onProfile({...profile,tags:{...profile.tags,[current.key]:[...selected,value]}});setCustom("");setError("")}
  function next(){if(!selected.length){setError("나를 표현하는 태그를 하나 이상 골라주세요.");return}setError("");setCustom("");if(step<TRAIT_STEPS.length-1)onStep(step+1);else onComplete()}
  return <div className="auth-card traits-card"><div className="progress-head"><span>프로필 만들기 {step+1} / {TRAIT_STEPS.length}</span><b>{selected.length} / {limit} 선택</b></div><div className="progress"><i style={{width:`${((step+1)/TRAIT_STEPS.length)*100}%`}}/></div><button className="back" onClick={()=>step?onStep(step-1):onBackToBasic()}>← 이전</button><h2>{current.icon} {current.title}</h2><p className="trait-lead"><b>{current.lead}</b><br/>{current.help}</p><div className="tag-grid">{options.map(tag=><button key={tag} className={selected.includes(tag)?"selected":""} onClick={()=>toggle(tag)}>{tag}</button>)}</div>{current.custom&&<div className="custom-tag"><p>{current.key==="topics"?<><b>남들이 잘 모르는 취향도 좋아요.</b><br/>F1, 인디게임, 시티팝처럼 구체적이면 더 좋아요.</>:"목록에 없다면 나만의 표현을 더해보세요."}</p><div><input value={custom} maxLength={20} onChange={e=>setCustom(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();addCustom()}}}/><button onClick={addCustom}>추가</button></div></div>}{current.key==="badges"&&<div className="badge-notes">{selected.map(name=><p key={name}><b>{name}</b><span>{TALK_BADGES.find(x=>x[0]===name)?.[1]}</span></p>)}</div>}{error&&<p className="error">{error}</p>}<button className="primary trait-next" onClick={next}>{step===TRAIT_STEPS.length-1?"프로필 완성하기":"다음으로"}<span>→</span></button></div>;
}
