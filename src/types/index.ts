// PRD §5 데이터 모델

export type Genre =
  | "액션"
  | "드라마"
  | "SF"
  | "코미디"
  | "로맨스"
  | "스릴러"
  | "애니메이션"
  | "공포";

export type EntrySource = "photo" | "mobile" | "booking" | "manual";

/** 관람 기록 1건 */
export interface DiaryEntry {
  id: string;
  movieId: string;
  title: string;
  posterUrl: string; // 가상 포스터 식별용 (CSS 그라데이션 키)
  watchedAt: string; // ISO — 예: 2026-08-02T19:20
  theater: string;
  screen: string;
  seat?: string;
  genre: Genre;
  source: EntrySource;
  createdAt: string;
}

/** 목데이터 영화 (실제 영화 사용 금지 — 가상 제목) */
export interface Movie {
  id: string;
  title: string;
  genre: Genre;
  runtime: number; // 분
  poster: PosterStyle;
}

/** 저작권 이슈 회피 — 포스터는 CSS 그라데이션 + 타이틀 텍스트로 생성 */
export interface PosterStyle {
  from: string;
  to: string;
  /** 포스터 위 장식 텍스트 (영문 카피) */
  tagline: string;
}

/** CGV 예매내역 목데이터 */
export interface Booking {
  id: string;
  movieId: string;
  watchedAt: string;
  theater: string;
  screen: string;
  seat: string;
}

/** 씨네톡 피드 게시물 */
export interface CinetalkPost {
  id: string;
  author: string;
  avatarColor: string;
  body: string;
  hashtags: string[];
  likes: number;
  comments: number;
  createdAt: string;
  mine?: boolean;
  /** 내 게시물일 때 공유 카드에 표시할 정보 */
  shareCard?: {
    level: number;
    titleName: string;
    count: number;
  };
}

export interface LevelRule {
  level: number;
  required: number; // 누적 관람 편수
  titleName: string; // 칭호
}

export type BadgeTier = "intro" | "fan" | "master";

export interface BadgeRule {
  id: string; // `${genre}-${tier}`
  genre: Genre;
  tier: BadgeTier;
  required: number;
  name: string;
}
