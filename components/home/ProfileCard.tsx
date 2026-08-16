"use client";
import { useState } from "react";
import { TALK_BADGES } from "../../app/profile-tags";
import { getFullAge } from "../../lib/profile-utils";
import { PublicProfile } from "../../types/profile";

export function ProfileCard({ profile, onRequest }: { profile:PublicProfile;onRequest:()=>void }) {
  const [flipped,setFlipped]=useState(false);const [badge,setBadge]=useState<string|null>(null);
  return <><div className={`meal-card theme-${profile.cardTheme} ${flipped?"is-flipped":""}`} onClick={()=>setFlipped(!flipped)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" ")setFlipped(!flipped)}} aria-label="프로필 카드 뒤집기"><div className="meal-card-inner">
    <article className="meal-card-face card-front"><header><span>MEAL PASS</span><b>잘되면<br/>밥한끼</b></header><div className="card-photo"><img src={profile.photo} alt={`${profile.name} 프로필`}/><i>NO. {profile.id.toUpperCase().padEnd(8,"0")}</i></div><div className="card-identity"><div><h2>{profile.name} <small>만 {getFullAge(profile.birthDate)}세</small></h2><p>{profile.region} · {profile.job}</p></div><em>{profile.mbti}</em></div><blockquote>“{profile.intro}”</blockquote><div className="card-sign"><small>PROFILE SIGN</small>{profile.signature.startsWith("data:image")?<img src={profile.signature} alt="프로필 사인"/>:<b>{profile.signature||profile.name}</b>}<span>✓ 본인 인증</span></div><footer>카드 터치해서 뒤집기 ↻</footer></article>
    <article className="meal-card-face card-back"><header><span>LET&apos;S TALK</span><b>무슨 얘기를<br/>좋아할까요?</b></header><CardTags title="💬 오래 할 수 있는 얘기" tags={profile.tags.topics}/><section className="talk-badges"><h3>🗣️ 나와 대화하면</h3><div>{profile.tags.badges.map(name=><button key={name} onClick={e=>{e.stopPropagation();setBadge(name)}}><i>{name.split(" ")[0]}</i><span>{name.substring(name.indexOf(" ")+1)}</span></button>)}</div></section><CardTags title="🧩 기본 성향" tags={profile.tags.basic}/><CardTags title="🏠 라이프스타일" tags={profile.tags.lifestyle}/><CardTags title="❤️ 연애 타입" tags={profile.tags.dating}/><footer>다시 터치하면 앞면으로 ↻</footer></article>
  </div></div><button className="request-banner" onClick={onRequest}>💬 이 사람에게 대화 신청하기 <span>→</span></button>{badge&&<div className="badge-sheet" role="button" tabIndex={0} aria-label="배지 설명 닫기" onClick={()=>setBadge(null)} onKeyDown={e=>{if(e.key==="Escape"||e.key==="Enter")setBadge(null)}}><div role="presentation" onClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()}><button onClick={()=>setBadge(null)}>×</button><strong>{badge}</strong><p>{TALK_BADGES.find(x=>x[0]===badge)?.[1]}</p></div></div>}</>;
}
function CardTags({title,tags}:{title:string;tags:string[]}){return <section className="card-tags"><h3>{title}</h3><div>{tags.map(tag=><span key={tag}>{tag}</span>)}</div></section>}
