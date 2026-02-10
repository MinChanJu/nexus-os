# 스타일 컨벤션

## 코드 스타일

- 모든 코드 파일은 프로젝트에서 사용하는 언어의 공식 스타일 가이드라인을 준수해야 합니다.
- 컴포넌트 파일명: PascalCase (예: MyComponent.js)
- 훅 등 파일명: kebab-case (예: use-auth.js, date-format.js)
- 목적 파일명: kebab-case + .목적 (예: date.types.ts, date.utils.ts)
- 폴더명: kebab-case (예: user-profile, data-services)
- 함수 및 변수명: camelCase (예: myFunction, myVariable)
- 상수명: UPPER_SNAKE_CASE (예: MAX_VALUE)
- 들여쓰기: 스페이스 2칸
- 줄바꿈: LF (Unix 스타일)

## prettier 설정

- 프로젝트에서는 [Prettier](https://prettier.io/)를 사용하여 코드 포맷팅을 자동화합니다.

```json
{
  "printWidth": 120,
  "tabWidth": 2,
  "trailingComma": "all",
  "singleQuote": false,
  "semi": true,

  "plugins": [
    "@trivago/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss"
  ],
  "importOrderSeparation": true,
  "importOrderSortSpecifiers": true,

  "importOrder": [
    "^react",
    "^next",
    "^@?\\w",
    "^@/",
    "^\\.{1,2}/",
    "\\.(css|scss|sass)$",
    "\\.(png|jpe?g|gif|svg|webp)$"
  ],

  "importOrderParserPlugins": ["typescript", "jsx", "decorators-legacy"],
  "tailwindFunctions": ["cva", "cx", "cn"]
}
```

## ignore 파일 설정

```
node_modules/
dist/
.env

.vscode/
.DS_Store
temp/
```

temp 폴더는 개발 중 생성되는 임시 파일들을 저장하는 용도로 사용됩니다. 이 폴더는 버전 관리에서 제외되어야 합니다.
