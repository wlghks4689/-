export type Provider = "kakao" | "google";
export type Gender = "male" | "female";
export type PhotoReview = "none" | "reviewing" | "approved" | "rejected";
export type ProfileTagKey = "basic" | "lifestyle" | "dating" | "topics" | "attraction" | "badges";
export type ProfileTags = Record<ProfileTagKey, string[]>;

export type Profile = {
  name: string;
  birthDate: string;
  gender: Gender | "";
  region: string;
  job: string;
  intro: string;
  photo: string;
  mbti: string;
  tags: ProfileTags;
};

export type DemoAccount = {
  provider: Provider | null;
  phoneVerified: boolean;
  profile: Profile;
  photoReview: PhotoReview;
};

export const EMPTY_TAGS: ProfileTags = { basic: [], lifestyle: [], dating: [], topics: [], attraction: [], badges: [] };
export const EMPTY_PROFILE: Profile = { name: "", birthDate: "", gender: "", region: "", job: "", intro: "", photo: "", mbti: "", tags: EMPTY_TAGS };
