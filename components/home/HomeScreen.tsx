"use client";
import { useMemo, useState } from "react";
import { DEMO_PROFILES, getPreferenceMatchScore } from "../../data/demo-profiles";
import { Profile, PublicProfile } from "../../types/profile";
import { ProfileCard } from "./ProfileCard";

export function HomeScreen({ me, onRequest }: { me:Profile;onRequest:(candidate:PublicProfile)=>void }) {
 const candidates=useMemo(()=>DEMO_PROFILES.filter(p=>p.gender!==me.gender).sort((a,b)=>getPreferenceMatchScore(me.tags.attraction[0],b)-getPreferenceMatchScore(me.tags.attraction[0],a)),[me]);const [index,setIndex]=useState(0);const candidate=candidates[index];
 return <div className="mobile-screen home-screen"><header className="app-header"><div><b>잘되면 밥한끼</b><span>오늘은 누구랑 얘기해볼까요?</span></div><button aria-label="알림">◌</button></header><ProfileCard profile={candidate} onRequest={()=>onRequest(candidate)}/><nav className="card-navigation" aria-label="프로필 카드 탐색"><button disabled={index===0} onClick={()=>setIndex(value=>Math.max(0,value-1))}><span>←</span> 이전 카드 보기</button><button disabled={index===candidates.length-1} onClick={()=>setIndex(value=>Math.min(candidates.length-1,value+1))}>다음 카드 보기 <span>→</span></button></nav></div>
}
