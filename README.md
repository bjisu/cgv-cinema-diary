# CGV 시네마 다이어리

파코니 NFC 굿즈 × CGV 앱 '시네마 다이어리' 고충실도 프로토타입입니다.
`docs/PRD.md` v1.1 기준으로 화면 11종이 모두 구현되어 있습니다.

## 로컬에서 실행하기

### 1단계. 준비물
- [Node.js LTS](https://nodejs.org) 설치 (터미널에서 `node -v` 입력 시 버전이 나오면 OK)

### 2단계. 설치 + 실행
```bash
npm install
npm run dev
```

### 3단계. 화면 확인
- 브라우저에서 `http://localhost:3000` 접속 → **더보기 화면**이 바로 뜹니다
- 개발자 도구(F12) → 기기 모드에서 iPhone(375px)로 보면 실제 앱처럼 확인 가능

### 그 외 명령어
| 명령 | 설명 |
|---|---|
| `npm run build` | 배포용 프로덕션 빌드 |
| `npm start` | 빌드 결과 실행 |
| `npm test` | 레벨·뱃지 판정 로직 단위 테스트 (vitest) |

## 데모 순서 (추천)

`/` 더보기 → **시네마 다이어리** → 영화표로 기록하기 → **CGV 예매내역 불러오기** → 저장
→ 레벨업 연출 → 씨네톡에 공유

- 시연용 관람 기록 2건이 미리 들어 있어, 3편째를 저장하면 Lv.2 레벨업 연출이 뜹니다.
- 초기화하려면 더보기 화면 맨 아래 **데모 데이터 초기화**를 누르세요 (FR-13).

## 화면 목록

| 경로 | 화면 |
|---|---|
| `/` · `/more` | **앱 첫 화면 = 더보기.** 스크린샷 1:1 재현, 시네마 다이어리 진입점 (FR-11, 12) |
| `/diary` | 시네마 다이어리 홈 (FR-02) |
| `/diary/verify` | 영화표 인증 3가지 방법 + 스캔 연출 (FR-03, 04) |
| `/diary/verify/result` | 자동 기입 결과 · 수정 · 저장 (FR-05, 06) |
| `/diary/levelup` | 파코니 레벨업 연출 (FR-07) |
| `/diary/badges` | 장르 취향 뱃지 (FR-08) |
| `/diary/archive` | 마이 무비 다이어리 (FR-09) |
| `/diary/share` | 씨네톡 공유 (FR-10) |
| `/nfc` | 파코니 굿즈 NFC 태그 시뮬레이션 (FR-01) — 매점 탭 굿즈 카드에서 진입 |
| `/onboarding` | 굿즈 태그 유도 온보딩 (FR-14) — 매점 굿즈 안내에서 진입 |
| `/home` `/cinetalk` `/booking` `/store` | CGV 앱 목업 탭 (FR-11) |

> 데이터는 전부 브라우저 localStorage(`cgv-cinema-diary`)에 저장됩니다. 서버·로그인·외부 DB 없음.

## 기술 스택

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Zustand(persist) · Framer Motion · lucide-react · Pretendard

## 프로젝트 구조

```
src/
├─ app/                  # 라우트 (PRD §8 구조와 1:1)
├─ components/
│  ├─ layout/            # MobileContainer, AppHeader, BottomTab, Hydrated
│  ├─ ui/                # PrimaryButton, GrayCard, GradeBar, BottomSheet, Toast, Poster
│  ├─ screens/           # MoreScreen (`/` 와 `/more` 가 공유)
│  └─ diary/             # PaconiCharacter (SVG 직접 제작)
├─ store/                # useDiaryStore (zustand + persist), useDraftStore
├─ data/                 # movies, bookings, cinetalk, levels, badges
├─ lib/                  # progression.ts (레벨·뱃지 판정), format.ts
└─ types/

docs/PRD.md              # 단일 기준 문서
.cursorrules             # 프로젝트 규칙 (기술 스택·디자인 원칙)
design-reference/        # 실제 CGV 앱 더보기 화면 스크린샷
```

## 배포 (Vercel)

1. [vercel.com](https://vercel.com) → **Add New > Project** → 이 GitHub 저장소 Import → **Deploy**
   (환경변수 설정 불필요 — 그냥 Deploy 버튼만 누르면 됩니다)
2. 이후 `main` 브랜치에 push 할 때마다 자동으로 재배포됩니다
