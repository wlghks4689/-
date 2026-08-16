import { DemoAccount, EMPTY_PROFILE, EMPTY_TAGS } from "../types/profile";

const STORAGE_KEY = "meal-demo-account";

export function loadAccount(): DemoAccount | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Partial<DemoAccount>;
    const profile = { ...EMPTY_PROFILE, ...data.profile, tags: { ...EMPTY_TAGS, ...data.profile?.tags } };
    return { provider: data.provider ?? null, phoneVerified: Boolean(data.phoneVerified), profile, photoReview: data.photoReview ?? (profile.photo ? "approved" : "none") };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function saveAccount(account: DemoAccount) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
}

export function clearAccount() {
  if (typeof window !== "undefined") window.localStorage.removeItem(STORAGE_KEY);
}
