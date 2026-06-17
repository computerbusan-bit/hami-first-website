# lecture1 프로젝트 가이드

## 역할
이 디렉토리는 React + MUI 강의 실습 환경입니다.

## 참조 문서
@docs/design-system.md
@docs/code-convention.md
@docs/new_project.md

## 기술 스택
- React 19 (Vite 기반)
- Material-UI (MUI) v9
- React Router DOM v7
- Roboto 폰트 (@fontsource/roboto)

## 디렉토리 구조
- `_template_settings/` : MUI + 테마 설정이 완성된 프로젝트 템플릿
- `docs/` : 디자인 시스템, 코드 컨벤션, 새 프로젝트 가이드 문서

## 새 프로젝트 생성 방법
1. `_template_settings` 디렉토리를 복사
2. 새 이름으로 변경 후 `npm install`
3. `npm run dev`로 개발 서버 시작

## 코딩 원칙
- @docs/code-convention.md 의 규칙을 따름
- @docs/design-system.md 의 디자인 토큰 사용
- MUI 컴포넌트 우선 사용
- 함수형 컴포넌트 + React Hooks 패턴 사용
