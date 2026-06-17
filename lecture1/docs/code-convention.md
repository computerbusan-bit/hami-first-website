# 코드 컨벤션 가이드

## 파일 및 디렉토리 네이밍
- 컴포넌트 파일: PascalCase (예: `UserCard.jsx`)
- 유틸리티 파일: camelCase (예: `formatDate.js`)
- 스타일 파일: 컴포넌트와 동일 이름 (예: `UserCard.css`)
- 페이지 컴포넌트: `pages/` 디렉토리에 위치

## 컴포넌트 작성 규칙
- 함수형 컴포넌트 사용 (클래스형 지양)
- Arrow function 형태 사용
- Props는 구조분해할당으로 받기
- PropTypes 또는 TypeScript 사용 권장

```jsx
// 올바른 예시
const UserCard = ({ name, email, avatar }) => {
  return (
    <Card>
      <CardContent>
        <Typography>{name}</Typography>
      </CardContent>
    </Card>
  );
};
```

## 임포트 순서
1. React 관련
2. 외부 라이브러리 (MUI, Router 등)
3. 내부 컴포넌트
4. 유틸리티 / 훅
5. 스타일 / 에셋

## 상태 관리
- useState: 로컬 UI 상태
- useContext: 전역 공유 상태
- 복잡한 상태는 useReducer 고려

## 코드 품질
- 함수는 단일 책임 원칙 준수
- 주석은 WHY를 설명 (WHAT은 코드가 설명)
- 불필요한 console.log 제거
- ESLint 규칙 준수
