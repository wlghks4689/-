"use client";
import { useMemo, useState } from "react";
import { DEMO_PROFILES, getPreferenceMatchScore } from "../../data/demo-profiles";
import { getSharedTopics } from "../../lib/profile-utils";
import { Profile, PublicProfile } from "../../types/profile";
import { ProfileCard } from "./ProfileCard";
import { RecommendationReason } from "./RecommendationReason";

export function HomeScreen({ me, onRequest }: { me:Profile;onRequest:(candidate:PublicProfile)=>void }) {
 const candidates=useMemo(()=>DEMO_PROFILES.filter(p=>p.gender!==me.gender).sort((a,b)=>getPreferenceMatchScore(me.tags.attraction[0],b)-getPreferenceMatchScore(me.tags.attraction[0],a)),[me]);const [index,setIndex]=useState(0);const candidate=candidates[index%candidates.length];const shared=getSharedTopics(me.tags.topics,candidate.tags.topics);const preferenceMatch=getPreferenceMatchScore(me.tags.attraction[0],candidate)>0;
 return <div className="mobile-screen home-screen"><header className="app-header"><div><b>잘되면 밥한끼</b><span>오늘은 누구랑 얘기해볼까요?</span></div><button aria-label="알림">◌</button></header><div className="filter-row"><button>지역⌄</button><button>나이⌄</button><button>필터</button></div><ProfileCard profile={candidate} onRequest={()=>onRequest(candidate)}/><RecommendationReason preferenceMatch={preferenceMatch} sharedCount={shared.length}/><button className="next-card" onClick={()=>setIndex((index+1)%candidates.length)}>다음 카드 보기 <span>→</span></button></div>
}
