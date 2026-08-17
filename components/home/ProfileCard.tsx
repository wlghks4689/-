"use client";
import { useState } from "react";
import { TALK_BADGES } from "../../app/profile-tags";
import { PublicProfile } from "../../types/profile";

function CardLogo(){return <img className="card-logo" src="/assets/meal-card-logo.svg" alt="잘되면 밥한끼"/>}
function AdaptivePill({children,large=false}:{children:string;large?:boolean}){return <span className={`adaptive-pill ${large?"large":""}`}>{children}</span>}
function DetailGroup({icon,title,tags}:{icon:string;title:string;tags:string[]}){return <section className="note-detail-group"><h4><i>{icon}</i>{title}</h4><div>{tags.map(tag=><AdaptivePill key={tag}>{tag}</AdaptivePill>)}</div></section>}

export function ProfileCard({profile,onRequest}:{profile:PublicProfile;onRequest:()=>void}){
 const [flipped,setFlipped]=useState(false);const [badge,setBadge]=useState<string|null>(null);
 const year=profile.birthDate?.slice(0,4)||"-";const favorites=profile.tags.topics.slice(0,3).join(", ")||"-";
 const flip=()=>setFlipped(value=>!value);
 return <><div className={`meal-card theme-${profile.cardTheme} ${flipped?"is-flipped":""}`}><div className="meal-card-inner">
  <div className="meal-card-face card-front" role="button" tabIndex={flipped?-1:0} aria-label="프로필 카드 뒷면 보기" onClick={()=>setFlipped(true)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setFlipped(true)}}}>
   <header className="card-title"><div className="spark-line">✦ ───────── ✧</div><div><h2>PROFILE CARD</h2><CardLogo/></div></header>
   <div className="card-photo"><img src={profile.photo} alt={`${profile.name} 프로필 사진`}/></div>
   <div className="profile-facts">
    <Fact icon="♙" label="NICKNAME" value={profile.name||"-"}/><Fact icon="▣" label="YEAR OF BIRTH" value={year}/>
    <Fact icon="♡" label="FAVORITES" value={favorites} wrap/><Fact icon="⌖" label="LOCATION" value={profile.region||"-"}/>
    <Fact icon="♢" label="MBTI" value={profile.mbti||"-"}/><div className="fact signature-fact"><span className="fact-icon">✦</span><div><small>SIGNATURE</small>{profile.signature.startsWith("data:image")?<img src={profile.signature} alt="프로필 사인"/>:<b className={profile.signature?"text-sign":"empty-sign"}>{profile.signature||"프로필 사인 없음"}</b>}</div></div>
   </div>
   <footer className="card-intro"><span>─ ✦</span><p>{profile.intro||"아직 한 줄 소개가 없어요."}</p><span>✦ ─</span></footer>
  </div>
  <article className="meal-card-face card-back" aria-hidden={!flipped}>
   <header className="note-header"><div className="spark-line">✦ ───────── ✧</div><div><h2>PROFILE NOTE</h2><CardLogo/></div><h3>무슨 얘기부터 꺼내볼까요?</h3></header>
   <div className="note-scroll">
    <section className="note-section topic-section"><h3>✦ <span>TALK TOPICS</span></h3><div>{profile.tags.topics.slice(0,5).map(topic=><AdaptivePill key={topic} large>{topic}</AdaptivePill>)}</div></section>
    <section className="note-section talk-badges"><h3>✦ <span>TALK BADGES</span></h3><div>{profile.tags.badges.slice(0,3).map(name=>{const split=name.indexOf(" ");return <button key={name} onClick={()=>setBadge(name)}><i>{split>0?name.slice(0,split):"✦"}</i><span>{split>0?name.slice(split+1):name}</span></button>})}</div></section>
    <section className="note-section more-about"><h3>✦ <span>MORE ABOUT ME</span></h3><DetailGroup icon="♙" title="PERSONALITY" tags={profile.tags.basic}/><DetailGroup icon="▣" title="LIFESTYLE" tags={profile.tags.lifestyle}/><DetailGroup icon="♡" title="LOVE STYLE" tags={profile.tags.dating}/></section>
   </div>
   <button className="flip-front" onClick={flip}>앞면 보기 <span>↻</span></button>
  </article>
 </div></div><button className="request-banner" onClick={onRequest}>💬 이 사람에게 대화 신청하기 <span>→</span></button>
 {badge&&<div className="badge-sheet" role="button" tabIndex={0} aria-label="배지 설명 닫기" onClick={()=>setBadge(null)} onKeyDown={e=>{if(e.key==="Escape"||e.key==="Enter")setBadge(null)}}><div role="presentation" onClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()}><button onClick={()=>setBadge(null)} aria-label="닫기">×</button><strong>{badge}</strong><p>{TALK_BADGES.find(x=>x[0]===badge)?.[1]}</p></div></div>}</>
}

function Fact({icon,label,value,wrap=false}:{icon:string;label:string;value:string;wrap?:boolean}){return <div className={`fact ${wrap?"wrap":""}`}><span className="fact-icon">{icon}</span><div><small>{label}</small><b>{value}</b></div></div>}
