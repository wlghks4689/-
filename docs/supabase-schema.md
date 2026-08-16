# Supabase 연결 준비 및 스키마 초안

현재 코드는 Supabase에 연결하지 않는다. 공식 클라이언트와 환경변수 진입점만 준비되어 있으며, 프로필은 계속 `localStorage`에 저장된다.

## 선택한 저장 구조

MVP에서는 기본 프로필은 `profiles`, 성향 선택은 `profile_tags` 관계 테이블로 분리한다. JSONB 한 칸보다 교집합 검색과 운영 태그 통계가 쉽고, 카테고리별 테이블을 여러 개 만드는 방식보다 단순하다. 사용자 직접 입력 태그는 `tag_id` 없이 `custom_label`에 저장한다.

```sql
create type public.profile_gender as enum ('male', 'female');
create type public.profile_tag_category as enum (
  'basic', 'lifestyle', 'dating', 'topics', 'attraction', 'badges'
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nickname text not null,
  birth_date date not null,
  gender public.profile_gender not null,
  region text not null,
  job text,
  intro text not null,
  mbti text,
  photo_url text not null,
  phone_verified boolean not null default false,
  photo_review_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_tag_definitions (
  id bigint generated always as identity primary key,
  category public.profile_tag_category not null,
  label text not null,
  target_gender public.profile_gender,
  description text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  unique (category, label, target_gender)
);

create table public.profile_tags (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  category public.profile_tag_category not null,
  tag_id bigint references public.profile_tag_definitions(id),
  custom_label text,
  created_at timestamptz not null default now(),
  check ((tag_id is not null) <> (custom_label is not null))
);
```

## 필수 서버 규칙

- 프로필 소유자만 자신의 프로필과 태그를 생성·수정하도록 RLS 적용
- 관리자 승인 전 `photo_review_status`를 클라이언트가 임의 변경하지 못하게 함
- 기본 성향·생활·연애·주제·끌림은 카테고리별 최대 5개, 배지는 최대 3개를 DB 함수/트랜잭션에서 강제
- 탐색 쿼리는 인증 사용자의 `gender` 반대 성별만 반환
- `birth_date`는 공개 응답에서 제외하고 서버 계산 만 나이만 노출
- 직접 입력 태그는 해당 프로필에만 귀속하고 추천 정의 테이블에 자동 추가하지 않음
- 사진 원본은 Supabase Storage 비공개 버킷에 저장하고 DB에는 경로/URL만 저장

## 실제 연결 전 필요한 작업

1. Supabase 프로젝트 생성
2. `.env.local`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 설정
3. SQL migration과 RLS 작성/검토
4. Auth 공급자(Kakao/Google) 설정
5. `lib/profile-storage.ts` 구현을 Supabase repository로 교체
6. Data URL 사진을 Storage 업로드로 교체
7. 서버에서 전화 인증과 사진 심사 상태를 검증

클라이언트에는 anon key만 사용한다. `service_role` 키는 서버 비밀로만 관리하고 브라우저 번들 또는 저장소에 넣지 않는다.
