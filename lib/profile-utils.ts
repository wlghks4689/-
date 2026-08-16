export function getFullAge(birthDate: string, today = new Date()) {
  const birth = new Date(`${birthDate}T00:00:00`);
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
  return age;
}

export function isValidKoreanMobile(value: string) {
  return /^01[016789]\d{7,8}$/.test(value.replaceAll("-", ""));
}

export function validateCustomTag(value: string) {
  const tag = value.trim();
  if (!tag) return "태그를 입력해 주세요.";
  if (tag.length > 20) return "태그는 20자 이하로 입력해 주세요.";
  if (/https?:|www\./i.test(tag)) return "URL은 태그에 넣을 수 없어요.";
  if (/\d{3}[- ]?\d{3,4}[- ]?\d{4}/.test(tag)) return "연락처는 태그에 넣을 수 없어요.";
  return null;
}

export function getSharedTopics(myTopics: string[], otherTopics: string[]) {
  const others = new Set(otherTopics);
  return myTopics.filter((topic) => others.has(topic));
}

export function getAdultBirthDateLimit(today = new Date()) {
  const date = new Date(today);
  date.setFullYear(date.getFullYear() - 18);
  return date.toISOString().slice(0, 10);
}
