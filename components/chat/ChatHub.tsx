"use client";
import { useState } from "react";
import { DEMO_PROFILES } from "../../data/demo-profiles";
import { PublicProfile } from "../../types/profile";

export type RequestItem={id:string;profile:PublicProfile;message:string};
export type ActiveChat={id:string;profile:PublicProfile;lastMessage:string};

export function ChatHub({sent,setSent,active,setActive,received,setReceived}:{sent:RequestItem[];setSent:(x:RequestItem[])=>void;active:ActiveChat[];setActive:(x:ActiveChat[])=>void;received:RequestItem[];setReceived:(x:RequestItem[])=>void}){
 const [tab,setTab]=useState<"active"|"received"|"sent">("active");const [shop,setShop]=useState(false);const [limit,setLimit]=useState(false);const [leaving,setLeaving]=useState<ActiveChat|null>(null);const total=2;
 function accept(item:RequestItem,source:"sent"|"received"){if(active.length>=total){setLimit(true);return}setActive([...active,{id:`chat-${item.id}`,profile:item.profile,lastMessage:"첫 인사를 건네보세요."}]);if(source==="sent")setSent(sent.filter(x=>x.id!==item.id));else setReceived(received.filter(x=>x.id!==item.id));setTab("active")}
 return <div className="mobile-screen chat-hub"><header className="app-header"><div><b>대화</b><span>서두르지 말고, 두 사람에게 집중해보세요.</span></div><button onClick={()=>setShop(true)} aria-label="대화 공간 안내">＋</button></header><div className="slot-meter"><span>내 대화 공간</span><b>{active.length} / {total}</b><i><em style={{width:`${active.length/total*100}%`}}/></i></div><nav className="chat-tabs"><TabButton active={tab==="active"} onClick={()=>setTab("active")} label="진행 중" count={active.length}/><TabButton active={tab==="received"} onClick={()=>setTab("received")} label="받은 요청" count={received.length}/><TabButton active={tab==="sent"} onClick={()=>setTab("sent")} label="보낸 요청" count={sent.length}/></nav>
 {tab==="active"&&<div className="chat-list">{active.length?active.map(chat=><article key={chat.id}><img src={chat.profile.photo} alt={`${chat.profile.name} 프로필`}/><div><b>{chat.profile.name}</b><p>{chat.lastMessage}</p></div><button onClick={()=>setLeaving(chat)} aria-label={`${chat.profile.name}님과의 대화 나가기`}>⇥</button></article>):<Empty text="대화가 시작되면 여기에 차곡차곡 모여요."/>}</div>}
 {tab==="received"&&<div className="request-list">{received.map(item=><RequestRow key={item.id} item={item} action="대화 시작하기" onAction={()=>accept(item,"received")}/>)}{!received.length&&<Empty text="새로 도착한 인사가 없어요."/>}</div>}
 {tab==="sent"&&<div className="request-list">{sent.map(item=><RequestRow key={item.id} item={item} action="수락 상태 보기" onAction={()=>accept(item,"sent")}/>)}{!sent.length&&<Empty text="마음에 남은 카드가 있다면 먼저 인사해보세요."/>}</div>}
 {shop&&<Modal onClose={()=>setShop(false)} title="대화 공간 안내"><p>기본 대화 공간은 2개예요. 요청을 주고받는 동안에는 공간을 사용하지 않습니다.</p><div className="slot-product"><b>대화 공간 +1</b><span>다음 단계에서 준비</span></div></Modal>}
 {limit&&<Modal onClose={()=>setLimit(false)} title="두 사람과 대화 중이에요"><p>새 대화를 시작하려면 지금 대화 중인 한 사람과 먼저 인사를 마무리해주세요.</p><button className="modal-main" onClick={()=>{setLimit(false);setShop(true)}}>대화 공간 안내 보기</button></Modal>}
 {leaving&&<Modal onClose={()=>setLeaving(null)} title="이 대화를 마칠까요?"><p>대화를 마치면 사용 중인 공간 하나가 다시 비워져요. 대화 내용은 이 데모에서 복구되지 않습니다.</p><button className="modal-danger" onClick={()=>{setActive(active.filter(x=>x.id!==leaving.id));setLeaving(null)}}>대화 마치기</button></Modal>}</div>
}
function TabButton({active,onClick,label,count}:{active:boolean;onClick:()=>void;label:string;count:number}){return <button className={active?"active":""} onClick={onClick}>{label}<small>{count}</small></button>}
function RequestRow({item,action,onAction}:{item:RequestItem;action:string;onAction:()=>void}){return <article><img src={item.profile.photo} alt={`${item.profile.name} 프로필`}/><div><b>{item.profile.name}</b><p>“{item.message}”</p><small>아직 대화 공간을 사용하지 않아요.</small></div><button onClick={onAction}>{action}</button></article>}
function Empty({text}:{text:string}){return <div className="empty-state"><span>💬</span><p>{text}</p></div>}
function Modal({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}){return <div className="app-modal" role="button" tabIndex={0} aria-label="팝업 닫기" onClick={onClose} onKeyDown={e=>{if(e.key==="Escape"||e.key==="Enter")onClose()}}><section role="presentation" onClick={e=>e.stopPropagation()} onKeyDown={e=>e.stopPropagation()}><button className="modal-close" onClick={onClose}>×</button><h2>{title}</h2>{children}</section></div>}

export function initialReceived(gender:ProfileGender):RequestItem[]{const candidates=DEMO_PROFILES.filter(p=>p.gender!==gender).slice(1,4);return candidates.map((p,i)=>({id:`received-${i}`,profile:p,message:["프로필의 여행 이야기가 궁금해요.","좋아하는 음악 얘기 나눠보고 싶어요.","같이 맛집 이야기해요!"][i]}))}
type ProfileGender="male"|"female"|"";
