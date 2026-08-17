"use client";
import { useState } from "react";
import { Profile, PublicProfile } from "../../types/profile";
import { ProfileCard } from "../home/ProfileCard";
import { ProfileSignature } from "./ProfileSignature";

export function MyProfile({profile,onProfile,onLogout}:{profile:Profile;onProfile:(p:Profile)=>void;onLogout:()=>void}){const [settings,setSettings]=useState(false);const publicProfile:PublicProfile={...profile,id:"MY-MEAL",verified:true};return <div className="mobile-screen my-profile"><header className="app-header"><div><b>내 프로필</b><span>상대에게 보이는 카드를 확인해보세요.</span></div><button onClick={()=>setSettings(!settings)} aria-label="설정">⚙</button></header>{settings&&<div className="settings-panel"><b>설정</b><button onClick={onLogout}>로그아웃</button></div>}<ProfileCard profile={publicProfile} onRequest={()=>{}}/><section className="profile-tools"><h3>카드 테마</h3><div>{(["coral","crimson","cream","sage","navy","lavender","mono"] as const).map(t=><button key={t} className={`theme-dot ${t} ${profile.cardTheme===t?"active":""}`} onClick={()=>onProfile({...profile,cardTheme:t})} aria-label={`${t} 테마`}/>)}</div></section><ProfileSignature onSave={signature=>onProfile({...profile,signature})}/><p className="private-note">🎯 추구미 키워드는 추천에만 사용되며 상대 카드에는 공개되지 않아요.</p></div>}
