# 잘되면 밥한끼 — 프로젝트 인수인계

작성 기준: 현재 저장소의 실제 코드 상태. 기획 문서에만 있고 코드에 없는 기능은 `미구현`으로 표기한다.

## 1. 현재 구현 완료된 기능

- 단일 페이지에서 동작하는 반응형 웹 프로토타입
- Kakao/Google 로그인 버튼과 로그인 이후 상태 전이
- 휴대전화 번호 형식 확인 및 데모 인증번호 확인
- 기본 프로필 작성: 사진, 닉네임, 생년월일, 성별, 지역, 직업, 소개
- 생년월일 기준 만 나이 계산 및 만 18세 미만 차단
- 사진 필수 업로드, 3MB 제한, 심사 중/승인 상태 UI
- 6단계 프로필 성향 작성
  - 기본 성향, 라이프스타일, 연애 타입, 대화 주제, 끌리는 분위기, 대화 성향 배지
- 태그 선택/해제, 선택 개수 표시, 단계 진행률 표시
- 일반 성향 태그 최대 5개, 대화 성향 배지 최대 3개 제한
- 기본 성향/라이프스타일/연애 타입/대화 주제 직접 입력 태그
- 직접 입력 태그 20자 제한 및 URL/전화번호 형태 기본 차단
- 성별에 따라 다른 `끌리는 분위기` 태그 목록 표시
- 프로필 카드와 전체 성향 태그 표시
- 대화 요청 화면 목업과 규칙 기반 대화 소재 힌트
- 브라우저 `localStorage`에 완성 프로필 저장 및 재진입 시 복원
- 프로필 성향 수정 진입 및 로그아웃 UI

## 2. 아직 목업이거나 미구현인 기능

### 목업

- Kakao/Google 로그인: 실제 OAuth 요청 없이 버튼 클릭으로 다음 화면 이동
- 휴대전화 인증: 실제 SMS/본인확인 없이 인증번호 `123456` 사용
- 사진 심사: 파일 업로드 후 1.2초 뒤 자동 승인되는 상태 전이만 구현
- 대화 요청: 입력 UI와 버튼만 있으며 요청 데이터가 생성되지 않음
- 공통 주제 힌트: 실제 상대 대신 `게임`, `맛집`, `AI` 고정 목록과 비교

### 미구현

- Supabase Auth/Postgres/Realtime/Storage 연동
- Apple 로그인과 Account Linking
- 실제 사용자 탐색/추천 및 이성 프로필 필터 쿼리
- 대화 요청 전송·수락·거절·취소
- 채팅방 생성, 메시지 저장, 실시간 채팅
- 신고, 차단, 계정 정지, 관리자 화면
- 활성 채팅 슬롯 계산·반환·구매
- 결제, 후원, `🍚 개발자 밥 사주기` 화면
- Push 알림
- 실제 얼굴 검수 및 관리자 재심사
- 서버 측 욕설/성적 표현/연락처/URL 검증
- 탈퇴, 개인정보 삭제, 약관 동의 이력
- 광고 UI와 광고 SDK

## 3. 현재 화면/페이지 구조

실제 라우트는 `/` 하나뿐이며, `app/page.tsx`의 `screen` 상태로 다음 화면을 전환한다.

```text
auth      Kakao/Google 로그인 선택
  ↓
phone     휴대전화 데모 인증
  ↓
edit      사진 및 기본 프로필 작성
  ↓
traits    6단계 성향 태그 작성
  ↓
profile   완성 프로필 카드/상세
  ↓
request   대화 요청 및 대화 힌트 목업
```

별도 URL, 라우터 페이지, 서버 API 라우트는 현재 제품 흐름에 없다. `examples/` 아래 API는 스타터 예제이며 제품에서 사용하지 않는다.

## 4. 주요 컴포넌트와 역할

현재 `app/page.tsx`는 화면 상태와 상위 흐름만 조정하고, 화면 UI와 검증은 역할별 컴포넌트로 분리되어 있다.

- `app/page.tsx`
  - `Home`: 화면 상태, 전체 프로필 상태, 화면 전환과 상위 콜백만 담당
- `components/auth/`
  - `SocialLogin`: Kakao/Google 로그인 목업
  - `PhoneVerification`: 휴대전화 번호와 데모 인증번호 검증
- `components/profile/`
  - `BasicProfileForm`: 사진 심사 목업과 기본 프로필 검증/입력
  - `ProfileTraitsWizard`: 6단계 태그 선택, 직접 태그 검증, 단계 진행
  - `ProfilePreview`: 완성 프로필 카드와 태그 표시
- `components/conversation/`
  - `ConversationRequest`: 대화 요청 목업 화면
  - `ConversationHints`: 공통 주제 기반 힌트 표시
- `components/BrandPanel.tsx`: 서비스 브랜드 패널
- `app/profile-tags.ts`
  - `PROFILE_TAGS`: 기본 성향, 라이프스타일, 연애 타입, 대화 주제, 성별별 끌림 태그 정의
  - `TALK_BADGES`: 대화 성향 배지 이름과 설명 정의
- `app/layout.tsx`
  - 한국어 루트 레이아웃, 폰트, 페이지 메타데이터
- `app/globals.css`
  - 전체 화면, 폼, 카드, 태그, 진행률, 대화 요청 UI 스타일
- `app/chatgpt-auth.ts`
  - 스타터에 포함된 ChatGPT 인증 헬퍼. 현재 제품 흐름에서 import하거나 사용하지 않음
- `types/profile.ts`: 프로필, 태그, 계정, 인증 공급자 타입과 빈 기본값
- `lib/profile-storage.ts`: `loadAccount`, `saveAccount`, `clearAccount` 로컬 저장 인터페이스
- `lib/profile-utils.ts`: 만 나이, 휴대전화, 직접 태그, 공통 주제 유틸리티
- `lib/supabase/client.ts`: 환경변수가 있을 때만 공식 Supabase 브라우저 클라이언트를 생성하는 준비 코드

## 5. 현재 데이터 구조

클라이언트 내부 타입:

```ts
type Profile = {
  name: string;
  birthDate: string;
  gender: "male" | "female" | "";
  region: string;
  job: string;
  intro: string;
  photo: string; // Data URL
  mbti: string;  // 타입에만 존재하며 현재 입력 UI 없음
  tags: {
    basic: string[];
    lifestyle: string[];
    dating: string[];
    topics: string[];
    attraction: string[];
    badges: string[];
  };
};
```

저장 키는 `meal-demo-account`이며 다음 형태를 `localStorage`에 JSON으로 저장한다.

```text
provider
phoneVerified
profile
photoReview
```

사진은 브라우저 Data URL로 함께 저장된다. 서버 데이터, 사용자 ID, 생성/수정 시각은 없다.

## 6. Supabase 테이블 및 연동 상태

- 공식 `@supabase/supabase-js` 패키지와 브라우저 클라이언트 생성 기반은 추가됨
- `.env.example`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 이름이 정의됨
- Supabase 프로젝트, Auth, DB, Storage, Realtime 모두 미연결
- 실제 마이그레이션과 RLS 정책 없음
- `db/schema.ts`는 의도적으로 비어 있음
- `db/index.ts`는 Cloudflare D1용 Drizzle 헬퍼지만 현재 호출되지 않음
- `.openai/hosting.json`의 `d1`, `r2`도 모두 `null`

권장 프로필 테이블과 RLS/Storage 원칙은 `docs/supabase-schema.md`와 `docs/profile-system.md`에 기록되어 있으나 실제 migration과 연결은 아직 구현되지 않았다.

## 7. 로그인/프로필/대화요청/채팅 구현 상태

| 영역 | 상태 | 실제 동작 |
|---|---|---|
| 로그인 | 목업 | Kakao/Google 버튼이 로컬 화면 상태만 변경 |
| 휴대전화 인증 | 목업 | 번호 형식 검사 후 `123456` 비교 |
| 프로필 | 작동하는 로컬 데모 | 작성·검증·표시·성향 수정·브라우저 저장 |
| 대화 요청 | 목업 | 힌트/입력/버튼 UI만 존재 |
| 채팅 | 미구현 | 채팅방, 메시지, Realtime 없음 |

로그아웃은 `clearAccount()`를 호출해 저장된 데모 계정을 삭제하고 프로필/인증/단계 상태를 초기화한다.

## 8. 프로필 태그 및 대화 성향 배지 구현 상태

- 태그 정의는 `app/profile-tags.ts`로 UI에서 분리됨
- 기본 성향/라이프스타일/연애 타입/대화 주제/끌리는 분위기: 각 최대 5개
- 대화 성향 배지: 최대 3개
- 직접 입력: 첫 네 영역에서 가능하며 선택 개수에 포함
- 직접 입력 태그는 현재 해당 프로필의 배열에만 저장됨
- 성별이 남성이면 여성 대상 끌림 목록, 여성이면 남성 대상 목록 표시
- 동성 탐색 제한은 UI 설명과 태그 분기에만 반영되며 실제 탐색 기능이 없어 서버 필터는 없음
- MBTI는 `Profile` 타입에 빈 문자열 필드만 있고 UI/저장 정책은 구현되지 않음

## 9. 활성 채팅 슬롯 BM 구현 상태

미구현이다. 무료 슬롯 3개, 활성 대화 판정, 슬롯 반환, 확장 상품, 결제 UI와 로직이 코드에 없다.

## 10. 개발자 밥 사주기 기능 구현 상태

미구현이다. 브랜드 문구에 `잘되면 밥 한 끼 사주세요`만 노출되며 후원 화면, 금액 선택, 결제, 후원 기록은 없다.

## 11. 최근 수정한 주요 파일

- `app/page.tsx`: 인증부터 프로필 성향, 상세, 대화 요청 목업까지 전체 제품 흐름
- `components/`: 인증, 기본 프로필, 성향 작성, 프로필 미리보기, 대화 요청 UI
- `types/profile.ts`: 공통 프로필 타입
- `lib/profile-storage.ts`, `lib/profile-utils.ts`: 저장 계층과 공통 검증/비교 로직
- `lib/supabase/client.ts`, `.env.example`: Supabase 클라이언트 연결 기반
- `docs/supabase-schema.md`: Supabase SQL 및 보안 정책 초안
- `app/profile-tags.ts`: 프로필 태그 및 대화 배지 데이터
- `app/globals.css`: 단계형 성향 UI, 프로필 카드, 대화 힌트 스타일
- `app/layout.tsx`: 서비스 제목과 설명 메타데이터
- `README.md`: 현재 구현 및 인증/사진 검수 제한 설명
- `docs/profile-system.md`: Supabase 권장 구조와 공통 주제 로직 설계
- `.openai/hosting.json`: Sites 프로젝트 ID와 비활성 D1/R2 설정

최근 커밋:

```text
a07c815 Add profile traits and conversation hints
4c65c33 Require reviewed profile photo and exact age
cc45dd1 Improve profile card readability
37a8d5f Add social and phone verification flow
a3f7eb2 Build Phase 0-1 dating app prototype
```

## 12. 현재 알고 있는 버그/문제

- 로그인, 휴대전화 인증, 얼굴 사진 검수가 실제 보안/인증 기능이 아님
- 사진 Data URL과 프로필 개인정보가 `localStorage`에 평문 저장됨
- 사진 심사는 사진 내용과 관계없이 시간 경과 후 승인됨
- 실제 상대가 없어 공통 주제 비교가 고정 목록에 의존함
- 대화 요청 보내기 버튼은 아무 데이터도 저장하지 않음
- 직접 입력 검증은 URL/전화번호 형태와 길이만 확인하며 욕설·우회 입력을 막지 못함
- 태그 정의가 운영자 DB가 아닌 코드 상수이므로 변경 시 재배포 필요
- `mbti` 필드는 사용하지 않음
- 패키지 이름은 과거 임시명인 `sai-dating-prototype`이고 배포 URL slug도 `sai-dating-prototype`임
- 자동화 테스트는 스타터의 렌더링 테스트뿐이며 주요 사용자 흐름 테스트가 없음
- 접근성, 실제 모바일 기기, 다양한 브라우저에 대한 별도 QA를 수행하지 않음

## 13. 다음 작업 후보

우선순위 제안:

1. Supabase 프로젝트 연결 및 환경변수 구성
2. `profiles`, 태그 정의/선택, 사진, 인증 식별자 테이블과 RLS 구현
4. Kakao/Google OAuth 및 휴대전화 본인확인 연결
5. 사진 Storage 업로드와 실제 얼굴 검수/관리자 재심사 연결
6. 반대 성별 프로필 탐색 및 서버 필터링 구현
7. 대화 요청 생성·수락·거절과 실제 공통 주제 교집합 구현
8. 채팅방·메시지·Realtime 구현
9. 신고/차단/관리자 기능 구현
10. 활성 채팅 슬롯 3개 정책과 슬롯 확장 UI 구현
11. `🍚 개발자 밥 사주기` 화면과 결제 공급자 결정
12. 사용자 흐름 테스트와 접근성 점검 추가

## 14. 프로젝트 실행 방법

필수 조건: Node.js `22.13.0` 이상.

```bash
npm install
npm run dev
```

기본 로컬 주소는 일반적으로 `http://localhost:3000`이다.

검증/빌드:

```bash
npm run build
npm test
npm run lint
```

현재 제품 실행에 필수인 사용자 환경변수는 없다. 코드가 참조하는 런타임/개발용 이름은 다음뿐이며 비밀값을 문서에 기록하지 않는다.

```text
CODEX_SANDBOX
WRANGLER_WRITE_LOGS
WRANGLER_LOG_PATH
MINIFLARE_REGISTRY_PATH
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

`db/index.ts`는 향후 Cloudflare D1을 사용할 경우 `DB` 바인딩을 기대하지만 현재 바인딩은 설정되지 않았다. Supabase 환경변수 이름도 아직 프로젝트에 정의되어 있지 않다.

## 15. 사용 중인 주요 라이브러리와 기술 스택

- React `19.2.6`
- React DOM `19.2.6`
- TypeScript `5.9.3`
- Vinext `1.0.0-beta.2`
- Vite `8.0.13`
- Tailwind CSS `4.2.1` (`@import "tailwindcss"`; 실제 화면 스타일은 대부분 `globals.css`의 일반 CSS)
- Cloudflare Vite Plugin / Wrangler
- OpenAI Sites Vite Plugin 및 Sites 배포
- Drizzle ORM / Drizzle Kit: 설치되어 있으나 제품 DB 스키마는 비어 있고 미사용
- Supabase JavaScript Client: 설치 및 클라이언트 팩토리 준비, 실제 프로젝트 미연결
- ESLint 및 React/JSX 접근성 플러그인
- 데이터 저장: 브라우저 `localStorage`
- 배포: 비공개 OpenAI Sites 프로젝트

---

보안 주의: 이 문서에는 비밀번호, 토큰, API Secret, Supabase `service_role` 키 등 실제 민감값을 기록하지 않는다. 향후 환경변수를 추가할 때도 `.env.example`에는 이름과 빈 값 또는 안전한 예시만 넣는다.
