---
name: pull-request
description: pull/request 내용 제안
user-invocable: true
---

# Pull Request 스킬

- 이번 업데이트에서 어떤 기능이 추가되었는지, 어떤 버그가 수정되었는지, 그리고 어떤 개선이 이루어졌는지를 명확하게 설명하는 Pull Request 내용을 제안합니다.
- PR 제목과 본문을 작성하여, 리뷰어가 변경 사항을 쉽게 이해할 수 있도록 돕습니다.
- PR 제목은 간결하면서도 핵심을 담아야 하며, 본문에서는 변경 사항의 상세 설명과 함께 관련 이슈 번호를 언급하는 것이 좋습니다.

## PR 제목 예시

- `{Project Name}: {간결한 변경 사항 설명}`
- 예시: `fe-lab: 프로젝트 초기 세팅 완료`

## PR 본문 예시

```
## Summary

이번 PR에서는 프로젝트의 초기 세팅을 완료하였습니다. Next.js 프로젝트를 생성하고, 필요한 패키지들을 설치하였으며, FSD 디렉토리 구조를 설정하였습니다. 또한 글로벌 스타일과 Provider 설정을 완료하고, 환경변수 세팅과 ESLint/Prettier 설정도 함께 진행하였습니다.

## Changes
- Next.js 프로젝트 생성 (App Router, TypeScript)
- 패키지 설치: `zustand`, `google-play-scraper`, `@google/generative-ai`, `tailwindcss`
- FSD 디렉토리 구조 생성 (`src/app`, `src/pages`, `src/widgets`, `src/features`, `src/shared`)
- 글로벌 스타일 및 Provider 설정 (`src/app/layout.tsx`)
- 환경변수 세팅 (`.env.local`): `GEMINI_API_KEY`
- ESLint / Prettier 설정

## Testing
- [ ] 프로젝트가 정상적으로 빌드되고 실행되는지 확인
- [ ] ESLint와 Prettier가 올바르게 작동하는지 확인
```
