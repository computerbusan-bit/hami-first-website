# 새 프로젝트 시작 가이드

## _template_settings 템플릿 활용

새 프로젝트를 시작할 때 `_template_settings`를 복사하여 사용합니다.

```bash
# lecture1 디렉토리에서
cp -r _template_settings my-new-project
cd my-new-project
npm install
npm run dev
```

## 포함된 패키지
- react + react-dom (최신 버전)
- react-router-dom (라우팅)
- @mui/material (UI 컴포넌트)
- @emotion/react + @emotion/styled (MUI 스타일링)
- @mui/icons-material (아이콘)
- @fontsource/roboto (폰트)

## 프로젝트 구조 권장사항
```
src/
├── components/     # 재사용 가능한 컴포넌트
├── pages/          # 페이지 컴포넌트
├── hooks/          # 커스텀 훅
├── utils/          # 유틸리티 함수
├── context/        # Context API
├── theme.js        # MUI 테마 설정
├── main.jsx        # 앱 진입점
└── App.jsx         # 루트 컴포넌트
```

## 라우터 설정 예시
```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 개발 서버 실행
```bash
npm run dev      # 개발 서버 (localhost:5173)
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 미리보기
```
