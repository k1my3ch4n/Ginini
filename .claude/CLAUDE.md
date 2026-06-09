# 🐹 프로젝트 개요 및 아키텍처 가이드 (Project Architecture)

## 1. 프로젝트 개요

- **프로젝트명:** 기니피그네이터 (Guineapigator) - 닮은꼴 기니피그 캐릭터 생성기
- **설명:** 사용자가 자신의 사진을 업로드하고, 닮은꼴 동물상(고양이상, 강아지상 등)을 선택하면 해당 인상이 반영된 기니피그 캐릭터를 생성해 주는 웹 서비스입니다. "고양이상 기니피그", "단발머리 회사원 기니피그"처럼 특징을 섞은 귀여운 캐릭터를 만들어 줍니다.
- **핵심 포지셔닝:** "정확한 변환"이 아닌 **"특징을 반영한 기니피그 프로필 캐릭터 생성기"**
- **활용 목적:** SNS 프로필 이미지, 카카오톡 프로필 등 개인 캐릭터 이미지로 활용
- **주요 타겟:** SNS 인증 및 재미 요소를 추구하는 일반 대중 (바이럴 루프 및 공유 기능 강조)

## 2. 프로젝트 목표

1. **사용자 경험(UX) 최적화:** 이미지 업로드 → 원형 크롭 → 닮은꼴 동물상 선택 → AI 변환 → 결과 확인까지의 흐름을 직관적으로 설계 (step 기반 상태 머신, 라이트박스 결과 뷰어 포함).
2. **효율적이고 확장 가능한 아키텍처 구축:** **FSD(Feature-Sliced Design)** 구조를 도입하여 프론트엔드 코드의 모듈성 및 유지보수성 극대화.
3. **효율적인 상태 관리 및 데이터 페칭:** 서버 상태(AI API 결과)와 클라이언트 상태(UI 단계, 이미지 데이터, 동물상 입력값)를 명확히 분리하여 성능 최적화.
4. **안전하고 비용 효율적인 AI 연동:** API Key 노출을 방지하는 백엔드 프록시 구조와 무분별한 요청을 막는 Rate Limit 구현. Replicate `flux-kontext-pro` 모델 사용.

## 3. 프로젝트 디렉토리 구조 및 개발 방식

### 🛠 기술 스택

- **Framework:** Next.js 16 (App Router) — SSR + API Route로 백엔드 프록시 일체형 구성
- **Language:** TypeScript
- **Styling:** Tailwind CSS v3
- **State Management:** Zustand (클라이언트 전역 상태 관리)
- **Data Fetching:** TanStack Query (서버 상태 관리 및 비동기 mutation 최적화)
- **Architecture:** Feature-Sliced Design (FSD)
- **AI API:** Replicate — `black-forest-labs/flux-kontext-pro` 모델 (기니피그 기본 프롬프트 + `animalTrait` 주입)
- **이미지 크롭:** react-image-crop
- **배포:** Vercel
- **SNS 공유:** 카카오톡 SDK, 트위터/X Web Intent

### 🔐 환경 변수 구조 (.env.local)

```
REPLICATE_API_TOKEN=         # Replicate API Token
NEXT_PUBLIC_KAKAO_APP_KEY=   # 카카오 JavaScript App Key
RATE_LIMIT_MAX=3             # 분당 최대 요청 수
RATE_LIMIT_WINDOW_SEC=60     # Rate Limit 윈도우 (초)
```

### ⚠️ Rate Limit 전략

- IP 기반, 분당 3회 제한
- 구현: `app/api/convert/route.ts` 내 in-memory Map (추후 Upstash Redis로 확장 가능)

### 🚨 에러 처리 전략

- 전역 `ErrorBoundary` 컴포넌트로 예기치 못한 렌더 에러 처리
- API 실패 시 `Toast` 알림 + `step → 'error'` 상태 전환
- 사용자에게 "다시 시도" 액션 항상 제공

### 📁 FSD 기반 디렉토리 구조 (Directory Structure)

```text
src/
├── app/                  # 애플리케이션의 라우팅 레이어 및 전역 설정
│   ├── layout.tsx
│   ├── page.tsx
│   └── api/
│       └── convert/      # AI API 호출을 중재할 백엔드 프록시 라우트 (Next.js 기준)
│           └── route.ts
│
├── views/                # 라우트별 실제 화면을 조립하는 페이지 레이어 (Next.js pages/ 충돌 방지로 views로 명명)
│   └── home/
│       └── ui/
│           └── HomeView.tsx
│
├── widgets/              # 여러 기능(Features)이 결합된 독립적인 UI 블록
│   └── converter/        # 업로더와 결과창이 결합된 변환기 위젯
│
├── features/             # 사용자의 상호작용 및 비동기 액션 중심의 기능 레이어
│   └── convert-to-guinea/# 이미지 기니피그화 핵심 기능
│       ├── api/
│       │   └── useConvertImage.ts # TanStack Query Mutation (AI 요청)
│       └── ui/
│           ├── ImageUploader.tsx  # 드래그앤드롭/파일 크롭 컴포넌트
│           └── ConversionResult.tsx # 변환된 이미지 렌더링 및 다운로드
│
├── entities/             # 비즈니스 도메인 모델 및 관련 상태 레이어
│   └── image-session/    # 변환 단계 및 업로드 이미지 세션 데이터
│       └── model/
│           └── store.ts  # Zustand Store (세션 상태 관리)
│
├── shared/               # 어떠한 슬라이스에도 종속되지 않는 공용 컴포넌트 및 유틸
│   ├── ui/               # Button, Input, Modal, Skeleton 등 공통 UI
│   ├── lib/              # 공통 유틸 함수
│   └── api/              # Axios/Fetch 기본 인스턴스 설정
```
