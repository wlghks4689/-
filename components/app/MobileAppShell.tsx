"use client";
import { useState } from "react";
import { getSharedTopics } from "../../lib/profile-utils";
import { Profile, PublicProfile } from "../../types/profile";
import { ChatHub, RequestItem, ActiveChat, initialReceived } from "../chat/ChatHub";
import { ConversationRequest } from "../conversation/ConversationRequest";
import { FeedPlaceholder } from "../feed/FeedPlaceholder";
import { HomeScreen } from "../home/HomeScreen";
import { MyProfile } from "../profile/MyProfile";

type Tab="home"|"chat"|"feed"|"profile";
export function MobileAppShell({profile,onProfile,onLogout}:{profile:Profile;onProfile:(p:Profile)=>void;onLogout:()=>void}){const [tab,setTab]=useState<Tab>("home");const [candidate,setCandidate]=useState<PublicProfile|null>(null);const [sent,setSent]=useState<RequestItem[]>([]);const [received,setReceived]=useState<RequestItem[]>(()=>initialReceived(profile.gender));const [active,setActive]=useState<ActiveChat[]>([]);
 function submitRequest(){if(!candidate)return;setSent([...sent,{id:`sent-${candidate.id}`,profile:candidate,message:"프로필을 보고 대화를 신청했어요."}]);setCandidate(null);setTab("chat")}
 return <div className="mobile-app-shell"><div className="app-content">{candidate?<div className="mobile-screen"><ConversationRequest sharedTopics={getSharedTopics(profile.tags.topics,candidate.tags.topics)} fallback={candidate.tags.topics[0]||"취미"} onBack={()=>setCandidate(null)} onSubmit={submitRequest}/></div>:tab==="home"?<HomeScreen me={profile} onRequest={setCandidate}/>:tab==="chat"?<ChatHub sent={sent} setSent={setSent} received={received} setReceived={setReceived} active={active} setActive={setActive}/>:tab==="feed"?<FeedPlaceholder/>:<MyProfile profile={profile} onProfile={onProfile} onLogout={onLogout}/>}</div><nav className="bottom-nav">{([['home','⌂','홈'],['chat','◌','대화'],['feed','▤','피드'],['profile','○','내 프로필']] as [Tab,string,string][]).map(([id,icon,label])=><button key={id} className={tab===id?"active":""} onClick={()=>{setCandidate(null);setTab(id)}}><i>{icon}</i><span>{label}</span>{id==="chat"&&sent.length>0&&<b>{sent.length}</b>}</button>)}</nav></div>}
