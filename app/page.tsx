"use client";

import { useEffect, useState } from "react";
import { BrandPanel } from "../components/BrandPanel";
import { PhoneVerification } from "../components/auth/PhoneVerification";
import { SocialLogin } from "../components/auth/SocialLogin";
import { MobileAppShell } from "../components/app/MobileAppShell";
import { BasicProfileForm } from "../components/profile/BasicProfileForm";
import { ProfileTraitsWizard } from "../components/profile/ProfileTraitsWizard";
import { clearAccount, loadAccount, saveAccount } from "../lib/profile-storage";
import { EMPTY_PROFILE, PhotoReview, Profile, Provider } from "../types/profile";

type Screen = "auth" | "phone" | "edit" | "traits" | "app";

export default function Home() {
  const [screen,setScreen]=useState<Screen>("auth");
  const [provider,setProvider]=useState<Provider|null>(null);
  const [profile,setProfile]=useState<Profile>(EMPTY_PROFILE);
  const [review,setReview]=useState<PhotoReview>("none");
  const [traitStep,setTraitStep]=useState(0);

  useEffect(()=>{const account=loadAccount();if(!account)return;queueMicrotask(()=>{setProvider(account.provider);setProfile(account.profile);setReview(account.photoReview);if(account.phoneVerified&&account.profile.name&&account.profile.photo&&account.profile.birthDate)setScreen("app")})},[]);

  function completeProfile(){saveAccount({provider,phoneVerified:true,profile,photoReview:"approved"});setScreen("app")}
  function logout(){clearAccount();setProvider(null);setProfile(EMPTY_PROFILE);setReview("none");setTraitStep(0);setScreen("auth")}

  if(screen==="app")return <MobileAppShell profile={profile} onProfile={next=>{setProfile(next);saveAccount({provider,phoneVerified:true,profile:next,photoReview:"approved"})}} onLogout={logout}/>;
  return <main className="app-shell"><BrandPanel/><section className="auth-panel"><div className="mobile-brand"><b>잘되면 밥한끼</b><span>대화부터 시작하는 소개팅</span></div>
    {screen==="auth"&&<SocialLogin onLogin={value=>{setProvider(value);setScreen("phone")}}/>}
    {screen==="phone"&&<PhoneVerification onBack={()=>setScreen("auth")} onVerified={()=>setScreen(profile.name&&profile.photo&&profile.birthDate?"app":"edit")}/>} 
    {screen==="edit"&&<BasicProfileForm profile={profile} review={review} onProfile={setProfile} onReview={setReview} onComplete={()=>{setTraitStep(0);setScreen("traits")}}/>}
    {screen==="traits"&&<ProfileTraitsWizard profile={profile} step={traitStep} onStep={setTraitStep} onProfile={setProfile} onBackToBasic={()=>setScreen("edit")} onComplete={completeProfile}/>} 
    <p className="legal">프로토타입 데모 · 정보는 이 기기에만 저장됩니다.</p>
  </section></main>;
}
