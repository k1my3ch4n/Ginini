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
- [ ] OG 메타 태그 설정 (SNS 공유 썸네일)

---

### 🛡️ Feature 8: 품질 및 배포

- [ ] `ErrorBoundary` 전역 에러 처리
- [ ] SEO 메타 태그 (`next/metadata`)
- [ ] 오픈그래프 이미지 생성 (`app/opengraph-image.tsx`)
- [ ] Vercel 배포 설정 (`vercel.json`, 환경 변수 등록)
- [ ] 라이트하우스 성능 체크 (목표: LCP < 2.5s)

---

## 개발 순서 권장

```
Feature 0 → Feature 1 → Feature 3 → Feature 2 → Feature 4 → Feature 5 → Feature 6 → Feature 7 → Feature 8
(설정)      (공통 UI)   (상태)      (업로드)    (AI 연동)   (결과)       (위젯 조립)  (홈)         (배포)
```
