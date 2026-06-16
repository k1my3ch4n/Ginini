# 🐹 Ginini (기니피그네이터)

사용자의 사진과 "닮은꼴 동물상"(고양이상, 강아지상 등)을 입력받아, 그 인상을 반영한 기니피그 캐릭터 이미지를 생성해 주는 웹 서비스입니다.

> "정확한 변환"이 아닌 **"특징을 반영한 기니피그 프로필 캐릭터 생성기"** — SNS 프로필, 카카오톡 프로필 등에 활용할 수 있는 캐릭터 이미지를 만들어 줍니다.

**서비스 주소:** [https://ginini.k1my3ch4n.xyz](https://ginini.k1my3ch4n.xyz)

## 기술 스택

- **Framework**: Next.js 16 (App Router) — SSR + API Route 일체형
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **State**: Zustand (클라이언트 상태), TanStack Query (서버 상태/비동기 mutation)
- **Architecture**: Feature-Sliced Design (FSD)
- **AI 파이프라인** (2단계)
  1. Gemini `gemini-2.5-flash-lite` — 업로드 사진에서 얼굴형/헤어스타일/헤어컬러 등 시각적 특징을 영문 텍스트로 추출
  2. Replicate `black-forest-labs/flux-2-pro` — 추출된 특징 + 기니피그 기본 프롬프트 + 동물상 트레잇을 결합해 이미지 생성 (text2img)
- **이미지 크롭**: react-image-crop (원형 크롭)
- **결과 영속화**: Vercel Blob (생성 이미지 + `/r/[id]` 공유 페이지 메타데이터)
- **Rate Limit**: Upstash Redis (`@upstash/ratelimit`, 미설정 시 in-memory 폴백)
- **배포**: Vercel
- **SNS 공유**: 카카오톡 SDK, 트위터/X Web Intent

## 시작하기

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local`에 채워야 할 값과 발급 방법은 [.env.example](.env.example) 주석을 참고하세요. 최소한 `REPLICATE_API_TOKEN`, `GEMINI_API_KEY`가 있어야 변환 기능이 동작합니다. Upstash/Vercel Blob/카카오 키는 미설정 시 각각 in-memory 폴백, 임시 URL(약 1시간), 공유 버튼 비활성으로 동작합니다.

## 스크립트

| 명령어                                       | 설명                                                                         |
| -------------------------------------------- | ---------------------------------------------------------------------------- |
| `npm run dev`                                | 개발 서버 실행                                                               |
| `npm run build`                              | 프로덕션 빌드                                                                |
| `npm run start`                              | 프로덕션 서버 실행                                                           |
| `npm run lint`                               | ESLint 검사                                                                  |
| `node scripts/test-analyze.mjs <이미지경로>` | Gemini 얼굴 특징 분석(`analyzeFace`)만 단독 실행해 결과 확인                 |
| `node scripts/test-convert.mjs <이미지경로>` | `analyzeFace` → `buildPrompt` → `generateImage` 전체 파이프라인을 CLI로 실행 |

## 디렉토리 구조 (FSD)

```text
src/
├── app/                  # 라우팅 레이어 (페이지 + API routes)
│   ├── api/convert/      # 변환 요청 처리 API
│   ├── api/cron/cleanup/ # 30일 경과 결과물 정리 cron
│   └── r/[id]/           # 결과 공유 페이지 + 동적 OG 이미지
├── views/                # 라우트별 화면 조립
├── widgets/              # 여러 feature가 결합된 UI 블록 (converter)
├── features/             # 사용자 인터랙션/비동기 액션 단위 기능
│   ├── image-upload/     # 업로드 + 원형 크롭
│   └── convert-to-guinea/
│       ├── api/          # TanStack Query mutation
│       ├── server/       # analyzeFace / buildPrompt / generateImage / persistResult
│       └── ui/           # 동물상 선택, 결과 화면
├── entities/             # 도메인 모델/상태 (image-session Zustand store)
└── shared/               # 공용 UI, lib(유틸), api
```

## 배포

Vercel에 배포하며, 필요한 환경 변수는 [.env.example](.env.example)을 참고해 Vercel 프로젝트 설정에 등록합니다. 결과 이미지는 30일 후 자동 정리되도록 [vercel.json](vercel.json)에 cron이 설정되어 있습니다.
