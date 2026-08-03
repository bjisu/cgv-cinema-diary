# CGV 시네마 다이어리 — 커서(Cursor) 개발 시작 가이드

파코니 NFC 굿즈 × CGV 앱 '시네마 다이어리' 프로토타입 개발용 스타터 패키지입니다.
**개발 문서는 이미 다 준비되어 있고, 커서에게 시키기만 하면 됩니다.**

## 이 폴더에 들어있는 것

| 파일 | 역할 |
|---|---|
| `docs/PRD.md` | 제품 요구사항 문서 v1.1 — 화면 8종 명세, 디자인 토큰, 데이터 모델 전부 포함 |
| `.cursorrules` | 커서가 자동으로 읽는 프로젝트 규칙 — 기술 스택·디자인 원칙 고정 |
| `design-reference/more-screen.png` | 실제 CGV 앱 '더보기' 화면 — 디자인 1:1 재현 기준 |
| `docs/CURSOR_START_PROMPT.md` | 커서에 붙여넣을 첫 프롬프트 (복사용) |

## 로컬에서 실행하기

### 1단계. 준비물
- [Node.js LTS](https://nodejs.org) 설치 (터미널에서 `node -v` 입력 시 버전이 나오면 OK)

### 2단계. 설치 + 실행
```bash
npm install
npm run dev
```

### 3단계. 화면 확인
- 브라우저에서 `http://localhost:3000` 접속
- 개발자 도구(F12) → 기기 모드에서 iPhone(375px)로 보면 실제 앱처럼 확인 가능

### 그 외 명령어
| 명령 | 설명 |
|---|---|
| `npm run build` | 배포용 프로덕션 빌드 |
| `npm start` | 빌드 결과 실행 |
| `npm test` | 레벨·뱃지 판정 로직 단위 테스트 (vitest) |

## 화면 둘러보기

| 경로 | 화면 |
|---|---|
| `/` | 첫 방문 온보딩 스플래시 (FR-14) |
| `/nfc` | 파코니 굿즈 NFC 태그 시뮬레이션 (FR-01) |
| `/more` | 더보기 — 실제 앱 스크린샷 1:1 재현, 시네마 다이어리 진입점 |
| `/diary` | 시네마 다이어리 홈 (FR-02) |
| `/diary/verify` | 영화표 인증 3가지 방법 (FR-03, 04) |
| `/diary/verify/result` | 자동 기입 결과 · 수정 · 저장 (FR-05, 06) |
| `/diary/levelup` | 파코니 레벨업 연출 (FR-07) |
| `/diary/badges` | 장르 취향 뱃지 (FR-08) |
| `/diary/archive` | 마이 무비 다이어리 (FR-09) |
| `/diary/share` | 씨네톡 공유 (FR-10) |
| `/home` `/cinetalk` `/booking` `/store` | CGV 앱 목업 탭 (FR-11) |

> 데이터는 전부 브라우저 localStorage(`cgv-cinema-diary`)에 저장됩니다. 서버·로그인 없음.
> 초기화하려면 더보기 화면 맨 아래 **데모 데이터 초기화**를 누르세요 (FR-13).

## 배포 (Vercel)

1. [vercel.com](https://vercel.com) → **Add New > Project** → 이 GitHub 저장소 Import → **Deploy**
   (환경변수 설정 불필요 — 그냥 Deploy 버튼만 누르면 됩니다)
2. 이후 `main` 브랜치에 push 할 때마다 자동으로 재배포됩니다

## 프로젝트 구조

```
src/
├─ app/                  # 라우트 (PRD §8 구조와 1:1)
├─ components/
│  ├─ layout/            # MobileContainer, AppHeader, BottomTab, Hydrated
│  ├─ ui/                # PrimaryButton, GrayCard, GradeBar, BottomSheet, Toast, Poster
│  └─ diary/             # PaconiCharacter (SVG 직접 제작)
├─ store/                # useDiaryStore (zustand + persist), useDraftStore
├─ data/                 # movies, bookings, cinetalk, levels, badges
├─ lib/                  # progression.ts (레벨·뱃지 판정), format.ts
└─ types/
```

## 문제가 생기면

커서 채팅에 에러 메시지를 그대로 붙여넣고 "고쳐줘"라고 하면 됩니다.
`.cursorrules`에 "에러는 스스로 진단·수정 후 한 문장으로 보고"하도록 설정되어 있습니다.
