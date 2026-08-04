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

/** 영화 목데이터 — TMDB Now Playing(KR) 기반 실제 상영작 (데모 용도) */
export interface Movie {
  id: string;
  /** TMDB 영화 id (포스터 파일명과 동일) */
  tmdbId: number;
  title: string;
  genre: Genre;
  runtime: number; // 분
  /** public/posters/ 아래 로컬 포스터 경로 */
  posterUrl: string;
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
    count: number;
  };
}

export interface LevelRule {
  level: number;
  required: number; // 누적 관람 편수
}

export type BadgeTier = "intro" | "fan" | "master";

export interface BadgeRule {
  id: string; // `${genre}-${tier}`
  genre: Genre;
  tier: BadgeTier;
  required: number;
  name: string;
}
