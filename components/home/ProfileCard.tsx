"use client";
import { useState } from "react";
import { TALK_BADGES } from "../../app/profile-tags";
import { PublicProfile } from "../../types/profile";

type IconName="user"|"calendar"|"heart"|"pin"|"spark"|"sign"|"cup";
function CardLogo(){return <img className="card-logo" src="/assets/meal-card-logo.svg" alt="잘되면 밥한끼"/>}
function CardIcon({name}:{name:IconName}){const paths={user:<><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.4-4.1 2.6-6.2 6.5-6.2s6.1 2.1 6.5 6.2"/></>,calendar:<><rect x="4" y="5.5" width="16" height="14" rx="2"/><path d="M8 3v5M16 3v5M4 10h16M8 14h2M14 14h2"/></>,heart:<path d="M12 20S4 15.4 4 9.4C4 5.7 8.7 4.1 12 8c3.3-3.9 8-2.3 8 1.4 0 6-8 10.6-8 10.6Z"/>,pin:<><path d="M12 21s6-5.6 6-11a6 6 0 1 0-12 0c0 5.4 6 11 6 11Z"/><circle cx="12" cy="10" r="2"/></>,spark:<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/>,sign:<><path d="M4 18c4-1 5-9 8-9 2 0-2 8 0 8 1.5 0 3-4 4-4s-1 4 1 4c1 0 2-1 3-2"/><path d="M5 21h15"/></>,cup:<><path d="M5 7h11v7a5.5 5.5 0 0 1-11 0V7Z"/><path d="M16 9h2a3 3 0 0 1 0 6h-2M8 3v2M12 3v2"/></>};return <svg className="card-line-icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>}
function AdaptivePill({children,large=false}:{children:string;large?:boolean}){return <span className={`adaptive-pill ${large?"large":""}`}>{children}</span>}
function DetailGroup({icon,title,tags}:{icon:IconName;title:string;tags:string[]}){return <section className="note-detail-group"><h4><i><CardIcon name={icon}/></i>{title}</h4><div>{tags.map(tag=><AdaptivePill key={tag}>{tag}</AdaptivePill>)}</div></section>}
function Fact({icon,label,value,wrap=false}:{icon:IconName;label:string;value:string;wrap?:boolean}){return <div className={`fact ${wrap?"wrap":""}`}><span className="fact-icon"><CardIcon name={icon}/></span><div><small>{label}</small><b>{value}</b></div></div>}

export function ProfileCard({profile,onRequest}:{profile:PublicProfile;onRequest:()=>void}){
 const [flipped,setFlipped]=useState(false);const [badge,setBadge]=useState<string|null>(null);const year=profile.birthDate?.slice(0,4)||"-";const favorites=profile.tags.topics.slice(0,3).join(", ")||"-";
 return <><div className={`meal-card theme-${profile.cardTheme} ${flipped?"is-flipped":""}`}><div className="meal-card-inner">
  <div className="meal-card-face card-front" role="button" tabIndex={flipped?-1:0} aria-label="프로필 카드 뒷면 보기" onClick={()=>setFlipped(true)} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();setFlipped(true)}}}>
   <header className="card-title"><div className="spark-line">✦ ───────── ✧</div><div><h2>PROFILE CARD</h2><CardLogo/></div></header><div className="card-photo"><img src={profile.photo} alt={`${profile.name} 프로필 사진`}/></div>
   <div className="profile-facts"><Fact icon="user" label="NICKNAME" value={profile.name||"-"}/><Fact icon="calendar" label="YEAR OF BIRTH" value={year}/><Fact icon="heart" label="FAVORITES" value={favorites} wrap/><Fact icon="pin" label="LOCATION" value={profile.region||"-"}/><Fact icon="spark" label="MBTI" value={profile.mbti||"-"}/><div className="fact signature-fact"><span className="fact-icon"><CardIcon name="sign"/></span><div><small>SIGNATURE</small>{profile.signature.startsWith("data:image")?<img src={profile.signature} alt="프로필 사인"/>:<b className={profile.signature?"text-sign":"empty-sign"}>{profile.signature||"프로필 사인 없음"}</b>}</div></div></div>
   <footer className="card-intro"><span>─ ✦</span><p>{profile.intro||"아직 한 줄 소개가 없어요."}</p><span>✦ ─</span></footer>
  </div>
  <article className="meal-card-face card-back" aria-hidden={!flipped}><header className="note-header"><div className="spark-line">✦ ───────── ✧</div><div><h2>PROFILE NOTE</h2><CardLogo/></div><h3>무슨 얘기부터 꺼내볼까요?</h3></header><div className="note-scroll">
   <section className="note-section topic-section"><h3>✦ <span>TALK TOPICS</span></h3><div>{profile.tags.topics.slice(0,5).map(topic=><AdaptivePill key={topic} large>{topic}</AdaptivePill>)}</div></section>
   <section className="note-section talk-badges"><h3>✦ <span>TALK BADGES</span></h3><div>{profile.tags.badges.slice(0,3).map(name=>{const split=name.indexOf(" ");return <button key={name} onClick={()=>setBadge(name)}><i>{split>0?name.slice(0,split):"✦"}</i><span>{split>0?name.slice(split+1):name}</span></button>})}</div></section>
   <section className="note-section more-about"><h3>✦ <span>MORE ABOUT ME</span></h3><DetailGroup icon="user" title="PERSONALITY" tags={profile.tags.basic}/><DetailGroup icon="cup" title="LIFESTYLE" tags={profile.tags.lifestyle}/><DetailGroup icon="heart" title="LOVE STYLE" tags={profile.tags.dating}/></section>
  </div><button className="flip-front" onClick={()=>setFlipped(false)}>앞면 보기 <span>↻</span></button></article>
 </div></div><button className="request-banner" onClick={onRequest}>💬 이 사람에게 대화 신청하기 <span>→</span></button>{badge&&<div className="badge-sheet" role="button" tabIndex={0} aria-label="배지 설명 닫기" onClick={()=>setBadge(null)} onKeyDown={e=>{if(e.key==="Escape"||e.key==="Enter")setBadge(null)}}><div role="presentation" onClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()}><button onClick={()=>setBadge(null)} aria-label="닫기">×</button><strong>{badge}</strong><p>{TALK_BADGES.find(x=>x[0]===badge)?.[1]}</p></div></div>}</>
}
