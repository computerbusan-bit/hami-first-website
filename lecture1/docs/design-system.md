# 디자인 시스템 가이드

## 컬러 팔레트
- Primary: `#1976d2` (MUI 기본 파란색)
- Secondary: `#dc004e` (MUI 기본 분홍색)
- Background: `#ffffff`
- Surface: `#f5f5f5`

## 타이포그래피
- 기본 폰트: Roboto (Google Fonts)
- H1: 2.125rem / 500 weight
- H2: 1.875rem / 500 weight
- Body1: 1rem / 400 weight
- Body2: 0.875rem / 400 weight

## 간격 시스템
- 기본 단위: 8px (MUI spacing)
- xs: 4px (0.5)
- sm: 8px (1)
- md: 16px (2)
- lg: 24px (3)
- xl: 32px (4)

## 컴포넌트 원칙
- MUI 컴포넌트를 우선 사용
- 커스텀 스타일은 `sx` prop 또는 `styled()` 활용
- 반응형 디자인: xs / sm / md / lg / xl 브레이크포인트 사용

## 아이콘
- @mui/icons-material 패키지 사용
- 아이콘 크기: small(20px), medium(24px), large(35px)
