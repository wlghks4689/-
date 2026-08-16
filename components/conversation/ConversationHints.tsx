export function ConversationHints({ sharedTopics, fallback }: { sharedTopics:string[];fallback:string }) {
  const topic=sharedTopics[0]||fallback;
  return <div className="conversation-hint"><span>💡</span><p><b>{sharedTopics.length?`두 분 모두 ${topic} 이야기를 좋아해요.`:`${topic} 이야기를 꺼내보세요.`}</b><br/>{sharedTopics.length?`${topic}에 빠지게 된 계기를 물어보는 건 어떨까요?`:`최근 가장 재미있었던 것을 물어보면 자연스러워요.`}</p></div>;
}
