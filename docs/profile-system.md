# 프로필 성향 시스템 설계

## 구현 구조

- 태그 정의: `app/profile-tags.ts`
- 단계형 선택 UI와 프로필 상세/대화 힌트: `app/page.tsx`
- 현재 저장소: 프로토타입용 `localStorage`

## Supabase 권장 구조

MVP에서는 태그 정의를 코드 상수로 관리하고, 선택 결과는 아래 관계형 구조로 저장한다. 검색·교집합·운영자 통계가 필요한 데이터이므로 한 프로필 JSONB에 모두 넣는 방식보다 연결 테이블이 적합하다.

```text
profiles
  id, user_id, nickname, birth_date, gender, region, job, bio, mbti, avatar_url

profile_tag_definitions
  id, category, label, target_gender, description, is_active, sort_order

profile_tag_selections
  profile_id, category, tag_definition_id nullable,
  custom_label nullable, is_custom, created_at
```

제약 조건:

- `(profile_id, category, tag_definition_id)` 중복 금지
- 직접 입력은 `tag_definition_id = null`, `is_custom = true`
- 직접 입력 태그는 다른 사용자 추천 목록에 자동 노출하지 않음
- 서버 함수에서 기본 성향·생활·연애·주제·끌림은 5개, 대화 배지는 3개로 제한
- `profiles.gender` 반대 성별만 탐색 쿼리에서 반환
- 생년월일 원문은 공개하지 않고 서버가 계산한 만 나이만 응답

## 공통 대화 주제

두 프로필의 `conversation_topics` 정규화 라벨을 교집합으로 비교한다. 공통 주제가 있으면 첫 항목을 기반으로 규칙형 질문을 보여주고, 없으면 상대가 선택한 첫 주제를 질문 소재로 사용한다. AI는 사용하지 않는다.

## 아직 목업인 기능

- Supabase 저장과 RLS
- 실제 상대 프로필 탐색 및 이성 필터링
- 실제 대화 요청 전송
- 운영자 태그 관리 UI
- 서버 욕설·연락처·URL 필터
