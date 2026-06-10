# 🐹 기니피그네이터 Todo List (v2 — 닮은꼴 기니피그 캐릭터 생성기)

## 📌 방향 전환 요약

> **기존:** 사진 → 카툰 기니피그 or 실사 기니피그 (모드 선택)
> **신규:** 사진 + 닮은꼴 동물 인상 입력 → "○○상 기니피그" 캐릭터 (항상 기니피그, 특징만 섞음)
>
> **핵심 포지셔닝:** "정확한 변환"이 아닌 **"특징을 반영한 기니피그 프로필 캐릭터 생성기"**
> 예: "고양이상 기니피그", "안경 쓴 회사원 기니피그", "단발머리 토끼상 기니피그"

---

## ✅ 확정된 기술 스택

| 항목        | 확정값                                 |
| ----------- | -------------------------------------- |
| Framework   | Next.js 16 (App Router)                |
| 스타일링    | Tailwind CSS v3                        |
| AI API      | Replicate (flux-kontext-pro)           |
| 이미지 크롭 | react-image-crop (원형 크롭으로 변경)  |
| Rate Limit  | IP 기반 in-memory (추후 Upstash Redis) |
| 배포        | Vercel                                 |
| SNS 공유    | 카카오톡 SDK + 트위터/X Web Intent     |
| 에러 처리   | ErrorBoundary + Toast                  |

---

## ✅ 완료된 기능 (유지)

### ✅ Feature 0–1: 프로젝트 설정 + 공통 UI

> 변경 없음. Button, Toast, ProgressBar, Skeleton, ErrorBoundary 모두 그대로 사용.

### ✅ Feature 2: 이미지 업로드 (드롭존)

> `ImageDropZone`, `ImagePreview` — 변경 없음.

### ✅ Feature 5: 변환 결과 화면

> `ConversionResult` — 공유 버튼, 다운로드, 다시 변환 — 변경 없음.

### ✅ Feature 6-7: 위젯 조립 + 홈 화면

> 레이아웃 구조는 유지, step 흐름만 수정 예정.

---

## 🔧 수정이 필요한 기존 기능

### 🔧 Modify 1: 이미지 크롭 → 원형(얼굴) 크롭으로 변경

_파일: `src/features/image-upload/ui/ImageCropModal.tsx`_

**현재 상태:** 자유형 사각형 크롭
**변경 목표:** 원형 크롭 + 얼굴 중심 가이드

- [ ] `ReactCrop`에 `circularCrop` prop 추가
- [ ] 초기 크롭 영역을 정사각형(1:1) 중앙으로 고정 → 원형으로 렌더링
- [ ] 가이드 문구 변경: "얼굴이 원 안에 들어오도록 맞춰주세요"
- [ ] 크롭 결과 Blob은 그대로 사각형으로 추출 (원형 마스킹은 결과 표시 시 CSS로 처리)

---

### 🔧 Modify 2: StyleSelectModal → AnimalSelectModal 교체

_파일: `src/features/convert-to-guinea/ui/StyleSelectModal.tsx` → **AnimalSelectModal.tsx**로 대체_

**현재 상태:** 카툰 / 실사 중 선택
**변경 목표:** 닮은꼴 동물 빠른 선택 + 직접 입력 (텍스트 추가)

- [ ] `StyleSelectModal.tsx` 파일 삭제
- [ ] `AnimalSelectModal.tsx` 신규 생성
  - 빠른 선택 옵션 (버튼형): 고양이상 / 강아지상 / 토끼상 / 여우상 / 곰상 / 기본 기니피그
  - 직접 입력 필드: "ex. 쿼카 느낌, 안경 쓴 회사원, 단발머리" (선택사항)
  - 빠른 선택 클릭 시 입력 필드에 자동 채워짐 (편집 가능)
  - 입력 없이 변환 가능 ("기본 기니피그"로 진행)
- [ ] `ConverterWidget.tsx`에서 import 교체

---

### 🔧 Modify 3: Zustand 스토어 상태 변경

_파일: `src/entities/image-session/model/store.ts`_

**현재 상태:** `conversionMode: 'cartoon' | 'realistic'`
**변경 목표:** `animalTrait: string` (닮은꼴 입력값)

- [ ] `conversionMode` 필드 및 `ConversionMode` 타입 제거
- [ ] `animalTrait: string` 필드 추가 (기본값: `""`)
- [ ] `setAnimalTrait` 액션 추가
- [ ] step 타입에서 `'style-select'` → `'animal-select'` 로 rename
- [ ] `reset()` 시 `animalTrait`도 초기화

---

### 🔧 Modify 4: API 라우트 프롬프트 재설계

_파일: `src/app/api/convert/route.ts`_

**현재 상태:** `mode`(cartoon/realistic)에 따라 두 가지 프롬프트 분기
**변경 목표:** 기니피그 기본 프롬프트 + `animalTrait` 주입

- [ ] `PROMPT_REALISTIC` 상수 제거
- [ ] `PROMPT_CARTOON` → `PROMPT_BASE`로 rename (기니피그 기본)
- [ ] `animalTrait`를 `formData`에서 추출
- [ ] `animalTrait`가 있을 경우 프롬프트 끝에 동적으로 추가:
  ```
  "The guinea pig character should subtly reflect the impression of a [animalTrait]: adopt characteristic eye shape, face proportions, and overall vibe of that animal type, while remaining a guinea pig."
  ```
- [ ] `mode` 파라미터 제거, `animalTrait` 파라미터로 교체

---

### 🔧 Modify 5: useConvertImage 훅 파라미터 변경

_파일: `src/features/convert-to-guinea/api/useConvertImage.ts`_

- [ ] `mode` 파라미터 → `animalTrait: string` 으로 교체
- [ ] `formData.append('mode', mode)` → `formData.append('animalTrait', animalTrait)` 로 변경

---

### 🔧 Modify 6: ConverterWidget step 흐름 업데이트

_파일: `src/widgets/converter/ui/ConverterWidget.tsx`_

- [ ] `style-select` → `animal-select` step으로 rename
- [ ] `StyleSelectModal` import → `AnimalSelectModal` import 교체
- [ ] 변환 버튼 클릭 시 `setStep('animal-select')` 로 변경

---

## 🆕 신규 기능

### 🆕 Feature A: 닮은꼴 선택 UX

> `AnimalSelectModal` 구현 세부사항

```
[빠른 선택 칩]
  🐱 고양이상  🐶 강아지상  🐰 토끼상
  🦊 여우상    🐻 곰상      🐹 기본 기니피그

[직접 입력]
  placeholder: "쿼카 느낌, 단발머리 회사원, 날카로운 눈매..."
  (선택사항 — 비워도 변환 가능)

[변환 시작 버튼]
```

- [ ] 빠른 선택 칩 → 입력 필드 자동 채움 (편집 허용)
- [ ] "기본 기니피그" 선택 시 `animalTrait = ""` 로 설정 (trait 없는 기본 프롬프트)
- [ ] 입력값 최대 50자 제한 (prompt injection 방지)
- [ ] 한국어/영어 모두 허용 (서버에서 영어 trait는 그대로, 한국어는 간단한 매핑 테이블 or 그대로 전달)

---

### 🆕 Feature B: 프롬프트 엔지니어링 고도화

_파일: `src/app/api/convert/route.ts`_

- [ ] 기본 기니피그 프롬프트 정제 (현재 PROMPT_CARTOON 기반 유지)
- [ ] 닮은꼴 trait 매핑 테이블 작성 (한국어 → 영어 prompt 조각)
  ```ts
  const TRAIT_MAP: Record<string, string> = {
    고양이상: "cat-like almond eyes and sharp graceful features",
    강아지상: "friendly round puppy eyes and warm cheerful expression",
    토끼상: "large gentle eyes and soft innocent expression",
    여우상: "sharp pointed eyes and clever sly expression",
    곰상: "wide round eyes and big friendly chubby face",
  };
  ```
- [ ] 자유 입력의 경우 그대로 prompt에 삽입 (50자 제한으로 안전)
- [ ] 프롬프트 결과물 테스트 및 반복 개선

---

### 🆕 Feature C: LoRA 학습 계획 (중장기)

> 스타일 LoRA로 기니피그 일러스트 스타일 고정 + IP-Adapter로 얼굴 특징 보존

#### C-1. 학습 데이터 준비

- [ ] 기니피그 캐릭터 일러스트 이미지 100~200장 수집 (동일 스타일 기준)
- [ ] 캡션 작성 (각 이미지 특징 설명)

#### C-2. LoRA 학습

- [ ] RunPod 또는 Vast.ai GPU 인스턴스 설정
- [ ] Kohya SS 또는 Flux LoRA 학습 스크립트 설정
- [ ] 스타일 LoRA 학습 (예상: A100 기준 1~3시간, $5~$20)
- [ ] 결과물 검증 및 반복

#### C-3. Replicate 연동

- [ ] 학습된 LoRA를 Replicate에 배포
- [ ] `route.ts`의 MODEL 상수를 커스텀 LoRA 모델로 교체
- [ ] IP-Adapter 조합 검토 (얼굴 특징 보존 강화)

---

## 🛡️ 기존 유지 항목 (변경 없음)

### Feature 8: 품질 및 배포

- [x] ErrorBoundary, SEO, OG 이미지
- [ ] Vercel 배포 설정
- [ ] 라이트하우스 성능 체크 (LCP < 2.5s)

### Feature 10: SNS 공유 (카카오)

- [ ] 카카오 개발자 콘솔 앱 생성 + 도메인 등록
- [ ] `.env.local` `NEXT_PUBLIC_KAKAO_APP_KEY` 입력
- [ ] 결과 이미지 공개 URL 확인

### Feature 11: 디자인 개선

- [ ] 로고, 파비콘, OG 이미지 실제 에셋 교체
- [ ] 컬러 팔레트 최종 확정

### Feature 12: 배포

- [ ] Vercel 환경 변수 등록 (`REPLICATE_API_TOKEN`, `NEXT_PUBLIC_KAKAO_APP_KEY` 등)
- [ ] Rate Limit 고도화 (Upstash Redis 검토)

---

## 📋 작업 우선순위 (구현 순서)

```
Modify 3 (스토어)
  → Modify 5 (훅)
  → Modify 4 (API 프롬프트)
  → Modify 2 (AnimalSelectModal 신규)
  → Modify 1 (원형 크롭)
  → Modify 6 (Widget step 흐름)
  → Feature B (프롬프트 고도화)
  → Feature A (닮은꼴 UX 세부)
  → (중장기) Feature C (LoRA)
```

---

## 🗒️ 변경 파일 요약

| 파일                                                  | 작업                                       |
| ----------------------------------------------------- | ------------------------------------------ |
| `entities/image-session/model/store.ts`               | `conversionMode` 제거 → `animalTrait` 추가 |
| `features/convert-to-guinea/api/useConvertImage.ts`   | `mode` → `animalTrait`                     |
| `app/api/convert/route.ts`                            | 프롬프트 재설계, `animalTrait` 주입        |
| `features/convert-to-guinea/ui/StyleSelectModal.tsx`  | **삭제**                                   |
| `features/convert-to-guinea/ui/AnimalSelectModal.tsx` | **신규 생성**                              |
| `features/image-upload/ui/ImageCropModal.tsx`         | 원형 크롭 + 가이드 문구                    |
| `widgets/converter/ui/ConverterWidget.tsx`            | step/import 업데이트                       |

---

## 🔄 v3 — img2img → text2img 전환 (Gemini Vision 분석 + Replicate flux-2-pro)

### 배경

- 현재: 업로드 사진을 `flux-kontext-pro`(img2img)에 직접 입력 → 결과 품질 편차/실패율 이슈
- 변경: 2단계 파이프라인
  1. **1단계 (분석):** Gemini `gemini-2.5-flash-lite`(멀티모달)로 업로드 사진을 분석 → 얼굴형/헤어스타일/헤어컬러/액세서리 등을 영문 텍스트로 추출
  2. **2단계 (생성):** 추출된 텍스트 + 기니피그 기본 프롬프트 + 동물상 트레잇(`TRAIT_MAP`)을 결합하여 `black-forest-labs/flux-2-pro`(text2img)로 이미지 생성

### 작업 항목

- [ ] `@google/genai` 패키지 설치
- [ ] `.env.local`, `.env.example`에 `GEMINI_API_KEY` 추가
- [ ] `src/app/api/convert/route.ts` 수정
  - [ ] Gemini 클라이언트 초기화 (`GEMINI_API_KEY`)
  - [ ] 1단계: 업로드 이미지를 `gemini-2.5-flash-lite`에 전달, 얼굴형/헤어스타일/헤어컬러/액세서리를 간결한 영문 묘사로 추출하는 프롬프트 작성 (이미지의 신원 정보가 아닌, 캐릭터 생성에 필요한 시각적 특징만 추출하도록 제한)
  - [ ] `PROMPT_BASE`를 img2img 표현("Transform the face in this photo...")에서 text2img용 자기완결 프롬프트로 재작성 (1단계 추출 텍스트를 삽입할 자리 마련)
  - [ ] `TRAIT_MAP` 결합 로직은 기존 그대로 유지
  - [ ] 2단계: `replicate.run("black-forest-labs/flux-2-pro", { input: { prompt, aspect_ratio, output_format, ... } })` 호출 (`input_image` 제거, flux-2-pro 입력 스키마 확인 후 파라미터 맞춤)
  - [ ] 에러 처리: Gemini 호출 실패(쿼터 초과/세이프티 차단 등)와 Replicate 호출 실패를 구분한 메시지 처리
  - [ ] `maxDuration` 재검토 (직렬 2단계 호출이라 120s로 충분한지 확인, 필요시 조정)
- [ ] 프론트엔드(`useConvertImage.ts`, 업로드 UI 등)는 변경 없음 — 사진 업로드 UX 그대로 유지, FormData로 이미지 전송
- [ ] 동작 검증: 실제 사진 업로드 → 1단계 텍스트 추출 결과 로그 확인 → 2단계 이미지 생성 결과 확인

### 검토 (작업 완료 후 작성)

---

## 🔄 v4 — 패키지 리팩토링 (route 분리 / 컴포넌트화 / lib 정리)

> 1 phase씩 진행 후 검토 요청 → 승인 시 다음 phase 진행

### Phase 1 (P0) — 즉시 처리

- [x] 죽은 코드 제거: `ImageDropZone.tsx`, `ImagePreview.tsx` 및 `index.ts` export 정리
- [x] `TRAIT_MAP`(서버) ↔ `ANIMAL_CHIPS`(클라이언트) 단일화 — `shared/lib/animal-traits.ts`로 통합

### Phase 2 (P1) — API route 분리

- [x] `src/shared/lib/rate-limit.ts` 분리 (checkRateLimit, getClientIP, RATE_LIMIT_MAX/WINDOW)
- [x] `src/features/convert-to-guinea/server/analyzeFace.ts` 분리 (FaceFeatures, ANALYSIS_PROMPT, ANALYSIS_SCHEMA, analyzeFace)
- [x] `src/features/convert-to-guinea/server/buildPrompt.ts` 분리 (PROMPT_BASE, TRAIT_MAP, buildPrompt)
- [x] `src/features/convert-to-guinea/server/generateImage.ts` 분리 (Replicate 클라이언트 + 생성 함수)
- [x] `route.ts`를 오케스트레이션만 남도록 정리

### Phase 3 (P2) — 유틸 추출 & 중복 제거

- [x] `getCroppedBlob` → `shared/lib/image.ts`
- [x] `downloadImage` → `shared/lib`
- [x] `processFile` 중복 제거 (Phase 1 결과에 따라 범위 조정)

### Phase 4 (P3) — 컴포넌트 분리

- [ ] `ConverterWidget`의 idle/error 화면 → 피쳐로 추출
- [ ] `ConversionResult` → `ResultLightbox` + `ResultCardView` 분리
- [ ] (선택) UploadOptionCard, Avatar, FullscreenSheet, ChipSelector, 아이콘 모음 정리

### Phase 5 (P3) — 코드 스타일 / lint 정리

- [ ] `if (!A) return;` / `if (A) B;` 형태의 단일 문장 if를 전부 중괄호 블록으로 변경 (현재 `AnimalSelectModal.tsx`, `ConversionResult.tsx`, `ConvertingLoader.tsx`, `shared/lib/kakao.ts`, `shared/lib/image.ts`는 적용 완료, 다른 파일들은 전수 점검 필요)
- [ ] ESLint `curly: ["error", "all"]` 규칙 추가 검토 — 추가 시 위 작업을 `eslint --fix`로 일괄 적용 가능
- [x] `AnimalSelectModal.tsx` `react-hooks/set-state-in-effect` 에러 해결 (croppedImage thumbnail URL 생성 로직을 effect 밖으로 이동 또는 다른 패턴으로 변경)
- [x] `AnimalSelectModal.tsx` 썸네일 `<img>`의 `@next/next/no-img-element` 경고 처리 (eslint-disable 주석 또는 next/image 적용)

### 검토 (각 phase 완료 후 작성)

**Phase 1 완료**

- `ImageDropZone.tsx`, `ImagePreview.tsx` 삭제 + `features/image-upload/index.ts` export 정리
- `src/shared/lib/animal-traits.ts` 신규: `ANIMAL_TRAIT_MAP`, `ANIMAL_TRAIT_KEYS` export
- `route.ts`의 로컬 `TRAIT_MAP` 제거 → `ANIMAL_TRAIT_MAP` import로 대체
- `AnimalSelectModal.tsx`의 `ANIMAL_CHIPS` 배열 제거 → `ANIMAL_TRAIT_KEYS` 사용
- `tsc --noEmit` 통과, 잔여 참조 없음 확인

**Phase 2 완료**

- `src/shared/lib/rate-limit.ts` 신규: `getClientIP`, `checkRateLimit` (RATE_LIMIT_MAX/WINDOW 포함)
- `src/features/convert-to-guinea/server/analyzeFace.ts` 신규: `FaceFeatures`, `analyzeFace` (Gemini 클라이언트·프롬프트·스키마 포함)
- `src/features/convert-to-guinea/server/buildPrompt.ts` 신규: `buildPrompt` (PROMPT_BASE 포함)
- `src/features/convert-to-guinea/server/generateImage.ts` 신규: `generateImage` (Replicate 클라이언트 포함)
- `route.ts`는 rate limit 체크 → analyzeFace → buildPrompt → generateImage 호출 + 에러 처리만 남김 (245줄 → 67줄)
- `tsc --noEmit` 통과

**Phase 3 완료**

- `src/shared/lib/image.ts`에 `getCroppedBlob`(canvas crop 변환), `downloadImage`(blob 다운로드) 추가, `index.ts`에서 export
- `ImageCropModal.tsx`의 로컬 `getCroppedBlob` 제거 → `@shared/lib` import로 대체
- `ConversionResult.tsx`의 로컬 `downloadImage` 제거 → `@shared/lib` import로 대체
- `processFile`은 `UploadScreen.tsx` 1곳에만 존재 (Phase 1에서 이미 중복 제거됨) — 추가 작업 불필요
- `tsc --noEmit` 통과
