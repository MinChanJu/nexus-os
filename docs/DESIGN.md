# WebOS 시스템 설계 문서

이 문서는 WebOS 프로젝트의 기술적 설계 내용을 담고 있습니다.

---

## 1. 시스템 아키텍처

### 1.1 프로젝트 구조

```
web-os/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 관련 페이지
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── api/               # API Routes
│   │   │   ├── auth/
│   │   │   ├── files/
│   │   │   └── user/
│   │   ├── desktop/           # 메인 데스크톱 페이지
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/            # React 컴포넌트
│   │   ├── desktop/
│   │   │   ├── Taskbar.tsx
│   │   │   ├── Desktop.tsx
│   │   │   ├── StartMenu.tsx
│   │   │   └── SystemTray.tsx
│   │   ├── window/
│   │   │   ├── Window.tsx
│   │   │   ├── WindowManager.tsx
│   │   │   ├── TitleBar.tsx
│   │   │   └── WindowContent.tsx
│   │   ├── apps/
│   │   │   ├── FileExplorer/
│   │   │   ├── TextEditor/
│   │   │   ├── ImageViewer/
│   │   │   ├── MediaPlayer/
│   │   │   ├── Terminal/
│   │   │   └── Settings/
│   │   ├── ui/               # 재사용 가능한 UI 컴포넌트
│   │   └── providers/        # Context Providers
│   ├── lib/                  # 유틸리티 & 헬퍼
│   │   ├── fs/              # 파일 시스템 로직
│   │   ├── db/              # IndexedDB 관리
│   │   ├── window/          # 창 관리 유틸리티
│   │   └── utils.ts
│   ├── stores/              # Zustand 스토어
│   │   ├── windowStore.ts
│   │   ├── fileSystemStore.ts
│   │   ├── appStore.ts
│   │   └── settingsStore.ts
│   ├── hooks/               # Custom React Hooks
│   │   ├── useWindow.ts
│   │   ├── useFileSystem.ts
│   │   └── useKeyboard.ts
│   ├── types/               # TypeScript 타입 정의
│   │   ├── window.ts
│   │   ├── file.ts
│   │   └── app.ts
│   └── styles/              # 전역 스타일
├── prisma/
│   └── schema.prisma        # 데이터베이스 스키마
├── public/
│   ├── icons/               # 앱 아이콘
│   ├── wallpapers/          # 기본 배경화면
│   └── sounds/              # 시스템 사운드
├── tests/
│   ├── unit/
│   └── e2e/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 1.2 데이터 흐름

```
사용자 입력
    ↓
React 컴포넌트
    ↓
Zustand Store (클라이언트 상태)
    ↓
API Routes / Server Actions
    ↓
Prisma ORM
    ↓
PostgreSQL / S3
```

### 1.3 창 관리 시스템 구조

```typescript
// Window State 구조
interface Window {
  id: string;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  state: "normal" | "maximized" | "minimized";
  zIndex: number;
  isActive: boolean;
  content: ReactNode;
}

// Window Manager Store
const useWindowStore = create<WindowStore>((set) => ({
  windows: [],
  openWindow: (window) => {
    /* ... */
  },
  closeWindow: (id) => {
    /* ... */
  },
  focusWindow: (id) => {
    /* ... */
  },
  minimizeWindow: (id) => {
    /* ... */
  },
  maximizeWindow: (id) => {
    /* ... */
  },
}));
```

### 1.4 파일 시스템 구조

```typescript
// File System Structure
interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  path: string;
  size?: number;
  mimeType?: string;
  content?: Blob | string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

// IndexedDB에 저장
// 클라우드와 주기적 동기화
```

---

## 2. UI/UX 설계

### 2.1 디자인 시스템

#### 2.1.1 색상 팔레트

- **라이트 모드**:
  - Primary: #3B82F6 (Blue)
  - Background: #F9FAFB
  - Surface: #FFFFFF
  - Text: #111827
- **다크 모드**:
  - Primary: #60A5FA
  - Background: #0F172A
  - Surface: #1E293B
  - Text: #F1F5F9

#### 2.1.2 타이포그래피

- 기본 폰트: Inter, 'Noto Sans KR' (한글)
- 모노스페이스: 'JetBrains Mono', monospace

#### 2.1.3 그림자 & 블러

- 창: `shadow-2xl` + `backdrop-blur-lg`
- 모달: `shadow-xl`
- 카드: `shadow-md`

### 2.2 반응형 디자인

- **데스크톱**: 1920x1080 기준 최적화
- **태블릿**: 터치 제스처 지원, UI 요소 확대
- **모바일**: 간소화된 UI, 하단 네비게이션

### 2.3 접근성 (A11y)

- 키보드 네비게이션 지원
- ARIA 레이블
- 색상 대비비 WCAG AA 준수
- 스크린 리더 지원

### 2.4 사용자 인터랙션

#### 2.4.1 키보드 단축키

- `Ctrl/Cmd + N`: 새 창
- `Ctrl/Cmd + W`: 창 닫기
- `Alt + Tab`: 창 전환
- `Ctrl/Cmd + F`: 검색
- `Ctrl/Cmd + S`: 저장
- `F11`: 전체화면

#### 2.4.2 마우스 제스처

- 더블 클릭: 파일/폴더 열기
- 우클릭: 컨텍스트 메뉴
- 드래그: 파일 이동, 창 이동
- 드래그 리사이즈: 창 크기 조절

---

## 3. 데이터베이스 스키마

### 3.1 Prisma Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  avatar        String?
  preferences   Json?     // 사용자 설정
  storageUsed   BigInt    @default(0)
  storageLimit  BigInt    @default(5368709120) // 5GB
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  files         File[]
  sessions      Session[]
}

model File {
  id          String    @id @default(cuid())
  userId      String
  name        String
  path        String
  type        String    // 'file' or 'folder'
  mimeType    String?
  size        BigInt?
  parentId    String?
  storageKey  String?   // S3 key
  content     String?   // 작은 파일의 경우
  metadata    Json?
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user        User      @relation(fields: [userId], references: [id])
  parent      File?     @relation("FileTree", fields: [parentId], references: [id])
  children    File[]    @relation("FileTree")

  @@index([userId, path])
  @@index([parentId])
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  user         User     @relation(fields: [userId], references: [id])
}
```

### 3.2 데이터 모델 설명

#### User 모델

- 사용자 계정 정보 관리
- 저장소 용량 관리 (사용량/할당량)
- 사용자 설정을 JSON으로 저장 (유연한 확장)

#### File 모델

- 파일 및 폴더의 메타데이터
- 트리 구조 지원 (self-referencing relation)
- 소프트 삭제 (isDeleted, deletedAt)
- 클라우드 저장소 키 (storageKey)

#### Session 모델

- 사용자 세션 관리
- 토큰 기반 인증
- 만료 시간 관리

---

## 4. API 설계

### 4.1 인증 API

#### POST /api/auth/register

사용자 회원가입

**요청:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**응답:**

```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### POST /api/auth/login

사용자 로그인

**요청:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**

```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "email": "user@example.com"
  }
}
```

### 4.2 파일 시스템 API

#### GET /api/files

파일/폴더 목록 조회

**쿼리 파라미터:**

- `path`: 폴더 경로 (기본값: "/")
- `type`: "file" | "folder" | "all"

**응답:**

```json
{
  "files": [
    {
      "id": "...",
      "name": "document.txt",
      "type": "file",
      "size": 1024,
      "mimeType": "text/plain",
      "createdAt": "2026-02-10T...",
      "updatedAt": "2026-02-10T..."
    }
  ]
}
```

#### POST /api/files

파일/폴더 생성

**요청:**

```json
{
  "name": "new-folder",
  "type": "folder",
  "parentId": "parent_folder_id"
}
```

#### PUT /api/files/:id

파일/폴더 수정 (이름 변경, 이동 등)

#### DELETE /api/files/:id

파일/폴더 삭제 (휴지통으로 이동)

#### POST /api/files/upload

파일 업로드 (multipart/form-data)

#### GET /api/files/:id/download

파일 다운로드

### 4.3 사용자 설정 API

#### GET /api/user/settings

사용자 설정 조회

#### PUT /api/user/settings

사용자 설정 업데이트

---

## 5. 상태 관리 설계

### 5.1 Zustand Stores

#### windowStore.ts

```typescript
interface WindowStore {
  windows: Window[];
  activeWindowId: string | null;
  openWindow: (app: App, props?: any) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  setWindowPosition: (id: string, position: Position) => void;
  setWindowSize: (id: string, size: Size) => void;
}
```

#### fileSystemStore.ts

```typescript
interface FileSystemStore {
  currentPath: string;
  files: FileNode[];
  selectedFiles: string[];
  clipboard: ClipboardData | null;
  navigateTo: (path: string) => void;
  selectFile: (id: string, multiSelect?: boolean) => void;
  createFile: (name: string, type: "file" | "folder") => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  renameFile: (id: string, newName: string) => Promise<void>;
  copyFile: (id: string) => void;
  cutFile: (id: string) => void;
  paste: () => Promise<void>;
}
```

#### settingsStore.ts

```typescript
interface SettingsStore {
  theme: "light" | "dark";
  accentColor: string;
  fontSize: number;
  wallpaper: string | null;
  locale: string;
  notifications: NotificationSettings;
  setTheme: (theme: "light" | "dark") => void;
  setAccentColor: (color: string) => void;
  setWallpaper: (url: string | null) => void;
}
```

---

## 6. 컴포넌트 설계

### 6.1 Window 컴포넌트

```typescript
interface WindowProps {
  id: string;
  title: string;
  position: Position;
  size: Size;
  state: WindowState;
  isActive: boolean;
  children: ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}
```

### 6.2 FileExplorer 컴포넌트

```typescript
interface FileExplorerProps {
  initialPath?: string;
  onFileSelect?: (file: FileNode) => void;
  allowMultiSelect?: boolean;
}
```

### 6.3 App 컴포넌트 인터페이스

모든 앱은 다음 인터페이스를 구현해야 합니다:

```typescript
interface AppComponent {
  id: string;
  name: string;
  icon: string;
  component: React.ComponentType<AppProps>;
  defaultSize: Size;
  minSize: Size;
  maxSize?: Size;
  allowMultipleInstances?: boolean;
}

interface AppProps {
  windowId: string;
  initialData?: any;
}
```

---

## 7. 성능 최적화 전략

### 7.1 코드 스플리팅

- 앱별 동적 import
- Route 기반 스플리팅
- 조건부 렌더링 시 lazy loading

```typescript
const TextEditor = lazy(() => import("@/components/apps/TextEditor"));
const ImageViewer = lazy(() => import("@/components/apps/ImageViewer"));
```

### 7.2 메모이제이션

- React.memo로 불필요한 리렌더링 방지
- useMemo로 비용이 큰 계산 캐싱
- useCallback으로 함수 참조 안정화

### 7.3 가상화

- 파일 목록이 많을 때 react-virtual 사용
- 무한 스크롤 구현

### 7.4 이미지 최적화

- Next.js Image 컴포넌트 사용
- WebP 포맷 변환
- 지연 로딩

---

## 8. 보안 설계

### 8.1 인증 플로우

1. 사용자 로그인 → JWT 토큰 발급
2. 토큰을 HttpOnly 쿠키에 저장
3. 모든 API 요청에 토큰 자동 포함
4. 서버에서 토큰 검증
5. 만료 시 자동 갱신 또는 재로그인

### 8.2 파일 업로드 보안

- 파일 타입 검증 (MIME type + 확장자)
- 파일 크기 제한 (예: 100MB)
- 바이러스 스캔 (선택)
- 파일명 sanitization

### 8.3 API 보안

- Rate Limiting (IP 기반)
- Input validation (Zod)
- SQL Injection 방어 (Prisma)
- XSS 방어 (DOMPurify)

---

## 9. 테스트 전략

### 9.1 단위 테스트

- 모든 유틸리티 함수
- Store 로직
- 커스텀 훅

### 9.2 컴포넌트 테스트

- UI 컴포넌트 렌더링
- 사용자 인터랙션
- 상태 변화

### 9.3 통합 테스트

- API Routes
- 데이터베이스 작업
- 인증 플로우

### 9.4 E2E 테스트

- 주요 사용자 플로우
- 크로스 브라우저 테스트
- 반응형 테스트

---

**최종 업데이트**: 2026년 2월 10일
