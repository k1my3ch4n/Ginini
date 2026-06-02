# 🐹 기니피그네이터 Todo List

## ✅ 확정된 기술 스택

| 항목        | 확정값                                 |
| ----------- | -------------------------------------- |
| Framework   | Next.js 16 (App Router)                |
| 스타일링    | Tailwind CSS v3                        |
| AI API      | **미정** — 초기 mock으로 진행          |
| 이미지 크롭 | react-image-crop                       |
| Rate Limit  | IP 기반 in-memory (추후 Upstash Redis) |
| 배포        | Vercel                                 |
| SNS 공유    | 카카오톡 SDK + 트위터/X Web Intent     |
| 에러 처리   | ErrorBoundary + Toast                  |

---

## 📋 기능별 Todo List

### ✅ Feature 0: 프로젝트 초기 설정

- [x] Next.js 16.2.6 + TypeScript 프로젝트 생성
- [x] 의존성 설치 (Tailwind CSS, Zustand, TanStack Query, Axios, react-image-crop)
- [x] FSD 디렉토리 골격 생성 (`views`, `widgets`, `features`, `entities`, `shared`) — `pages`→`views` 변경 (Next.js 충돌 방지)
- [x] path alias 설정 (`@views/*`, `@features/*`, `@entities/*`, `@shared/*`, `@widgets/*`)
- [x] `.env.local` + `.env.example` 생성
- [x] 빌드 검증 완료 (`npm run build` 통과)

---

### ✅ Feature 1: 공통 UI 기반 (shared/ui)

- [x] `Button` 컴포넌트 (variant: primary / ghost / icon)
- [x] `Skeleton` 컴포넌트 (이미지 로딩 플레이스홀더)
- [x] `Toast` / 에러 알림 컴포넌트 (`useToast` hook + `ToastContainer`)
- [x] `ProgressBar` 컴포넌트 (변환 진행률 표시)
- [x] `shared/api` - Axios 인스턴스 설정 (baseURL, 인터셉터)
- [x] `shared/lib` - 이미지 유틸 함수 (파일 크기/타입 검증, base64 변환)

---

### ✅ Feature 2: 이미지 업로드

_FSD: `features/image-upload`_

- [x] 드래그앤드롭 업로드 영역 UI (`ImageDropZone`)
- [x] 클릭으로 파일 선택 기능
- [x] 이미지 파일 유효성 검사 (jpg/png/webp, 최대 10MB)
- [x] 이미지 미리보기 렌더링 (`ImagePreview` — 크롭 수정/다시 선택 포함)
- [x] 이미지 크롭 모달 (`react-image-crop` 연동)
- [x] 크롭 완료 → Blob/DataURL 추출 후 스토어 저장

---

### ✅ Feature 3: 이미지 세션 상태 관리

_FSD: `entities/image-session/model/store.ts`_

- [x] Zustand 스토어 정의
  - `step`: `'idle' | 'cropping' | 'converting' | 'done' | 'error'`
  - `uploadedImage`: 원본 이미지 DataURL
  - `croppedImage`: 크롭된 이미지 Blob
  - `resultImage`: AI 변환 결과 URL
- [x] 단계 전환 액션 (`setStep`, `reset`)
- [x] 이미지 저장/초기화 액션

---

### ✅ Feature 4: AI 변환 연동

_FSD: `features/convert-to-guinea`_

- [x] 백엔드 프록시 API 라우트 구현 (`app/api/convert/route.ts`)
  - AI API 호출 (현재 mock — 2초 지연 + placeholder URL, 추후 fal.ai/Replicate 교체)
  - API Key 서버사이드 보호 구조 완비
- [x] Rate Limit 미들웨어 (IP 기준, 분당 3회, in-memory Map)
- [x] `useConvertImage` TanStack Query `useMutation` 훅
  - 요청 시 `step` → `'converting'`
  - 성공 시 `resultImage` 저장 → `step` → `'done'`
  - 실패 시 `step` → `'error'` + 에러 토스트
- [x] 변환 중 프로그레스 애니메이션 / 로딩 UI (`ConvertingLoader`)

---

### ✅ Feature 5: 변환 결과 화면

_FSD: `features/convert-to-guinea/ui/ConversionResult.tsx`_

- [x] 원본 / 결과 이미지 비교 렌더링 (Before & After)
- [x] 결과 이미지 다운로드 기능 (`<a download>`)
- [x] 카카오톡 공유 버튼 (Kakao SDK)
- [x] 트위터/X 공유 버튼 (Web Intent URL)
- [x] "다시 변환하기" 버튼 → 스토어 `reset` + `step` → `'idle'`

---

### ✅ Feature 6: 컨버터 위젯 조립

_FSD: `widgets/converter`_

- [x] `ConverterWidget` - ImageUploader + ConversionResult 통합
- [x] `step` 상태에 따른 조건부 렌더링
  - `idle / cropping` → 업로드 UI
  - `converting` → 로딩 UI
  - `done` → 결과 UI
  - `error` → 에러 UI + 재시도 버튼
- [x] 단계 전환 시 애니메이션 (CSS fade-in keyframe)

---

### ✅ Feature 7: 홈페이지 완성

_FSD: `views/home` + `app/page.tsx`_

- [x] 랜딩 헤더 (로고, 타이틀, 간단한 설명)
- [x] `ConverterWidget` 배치
- [x] 푸터 (저작권, 안내 문구)
- [x] 반응형 레이아웃 (모바일 우선)
- [x] OG 메타 태그 설정 (SNS 공유 썸네일)

---

### 🛡️ Feature 8: 품질 및 배포

- [x] `ErrorBoundary` 전역 에러 처리
- [x] SEO 메타 태그 (`next/metadata`)
- [x] 오픈그래프 이미지 생성 (`app/opengraph-image.tsx`)
- [ ] Vercel 배포 설정 (`vercel.json`, 환경 변수 등록)
- [ ] 라이트하우스 성능 체크 (목표: LCP < 2.5s)

---

### 🤖 Feature 9: AI API 실제 연동

> 현재 `app/api/convert/route.ts`는 2초 mock 응답. 아래 작업으로 교체.

#### 9-1. AI 서비스 선정 (택 1)
- [ ] **fal.ai** — `fal-ai/imageutils` 또는 스타일 트랜스퍼 모델 검토
- [ ] **Replicate** — `stability-ai` 계열 이미지 변환 모델 검토
- [ ] **OpenAI DALL·E 3** — image edit API (`gpt-image-1`) 검토

#### 9-2. 연동 구현
- [ ] `.env.local`에 `AI_API_KEY`, `AI_API_URL` 실제 값 입력
- [ ] `app/api/convert/route.ts` — mock 블록을 실제 API 호출로 교체
  - `multipart/form-data`로 이미지 전송 또는 base64 인코딩 여부 확인
  - 응답에서 결과 이미지 URL 또는 base64 추출 → `resultUrl` 반환
- [ ] 타임아웃 처리 (AI 응답이 느릴 경우 30s 제한 권장)
- [ ] 실패 응답 케이스별 에러 메시지 분기 (잔액 부족, 콘텐츠 필터 등)

#### 9-3. 프롬프트 설계
- [ ] 기니피그 캐릭터화 프롬프트 작성 (헤어스타일·안경·표정 유지 조건 포함)
- [ ] 프롬프트를 서버 코드 내 상수로 관리 (`app/api/convert/route.ts`)

---

### 💬 Feature 10: SNS 공유 (카카오)

> 카카오 공유는 배포 도메인이 확정된 후 진행.

- [ ] [카카오 개발자 콘솔](https://developers.kakao.com)에서 앱 생성
- [ ] 플랫폼 → 웹 → 배포 도메인 등록 (`https://your-domain.vercel.app`)
- [ ] JavaScript 앱 키 → `.env.local` `NEXT_PUBLIC_KAKAO_APP_KEY` 입력
- [ ] `app/layout.tsx`에 Kakao SDK `<Script>` 태그 로드 확인
- [ ] 카카오 공유 시 `imageUrl`이 공개 접근 가능한 URL인지 확인
  - 현재 mock의 `placehold.co` URL은 공유 가능, 실제 AI 결과 URL도 공개여야 함

---

### 🎨 Feature 11: 디자인 개선 (이미지 교체 및 비주얼 업데이트)

> 현재 기본 placeholder 이미지 사용 중. 아래 작업으로 실제 디자인 에셋 교체 예정.

- [ ] 로고 이미지 교체 (`public/` 내 실제 로고 파일로 변경)
- [ ] 홈 히어로 이미지/일러스트 교체 (현재 텍스트 기반 → 기니피그 캐릭터 이미지 적용)
- [ ] OG 이미지 (`app/opengraph-image.tsx`) 실제 브랜드 이미지로 교체
- [ ] 파비콘 교체 (`app/favicon.ico` → 기니피그 아이콘)
- [ ] 변환 로딩 UI 이미지/애니메이션 개선 (`ConvertingLoader`)
- [ ] 전체 컬러 팔레트 및 타이포그래피 최종 확정 후 Tailwind config 업데이트

---

### 🚀 Feature 12: 배포

- [ ] `vercel.json` 생성 (필요 시 — Vercel 기본 설정으로 충분하면 생략)
- [ ] Vercel 프로젝트 연결 및 환경 변수 등록
  - `AI_API_KEY`
  - `AI_API_URL`
  - `NEXT_PUBLIC_KAKAO_APP_KEY`
  - `RATE_LIMIT_MAX=3`
  - `RATE_LIMIT_WINDOW_SEC=60`
- [ ] 첫 배포 후 실제 도메인에서 전체 플로우 동작 확인
- [ ] Rate Limit 고도화 검토 — 서버리스 환경에선 in-memory Map이 인스턴스별로 초기화됨
  - 해결책: Upstash Redis 연동 (`@upstash/ratelimit`)
- [ ] 라이트하우스 성능 체크 (목표: LCP < 2.5s)

---

## 개발 순서 권장

```
Feature 0 → Feature 1 → Feature 3 → Feature 2 → Feature 4 → Feature 5 → Feature 6 → Feature 7 → Feature 8
(설정)      (공통 UI)   (상태)      (업로드)    (AI 연동)   (결과)       (위젯 조립)  (홈)         (배포)
```
