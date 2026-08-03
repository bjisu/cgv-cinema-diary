import type { Movie } from "@/types";

/**
 * TMDB Now Playing(region=KR) 기준 실제 상영작 12편 — 데모 용도.
 * scripts/fetch-movies.mjs 로 자동 생성됨. 직접 수정하지 말 것.
 * 포스터 이미지는 public/posters/ 에 함께 저장된다.
 */
export const MOVIES: Movie[] = [
  {
    id: "m01",
    tmdbId: 969681,
    title: "스파이더맨: 브랜드 뉴 데이",
    genre: "액션",
    runtime: 145,
    posterUrl: "/posters/969681.jpg",
  },
  {
    id: "m02",
    tmdbId: 1368337,
    title: "오디세이",
    genre: "액션",
    runtime: 173,
    posterUrl: "/posters/1368337.jpg",
  },
  {
    id: "m03",
    tmdbId: 1081003,
    title: "슈퍼걸",
    genre: "액션",
    runtime: 108,
    posterUrl: "/posters/1081003.jpg",
  },
  {
    id: "m04",
    tmdbId: 1108427,
    title: "모아나",
    genre: "코미디",
    runtime: 115,
    posterUrl: "/posters/1108427.jpg",
  },
  {
    id: "m05",
    tmdbId: 1315772,
    title: "미니언즈 & 몬스터즈",
    genre: "애니메이션",
    runtime: 90,
    posterUrl: "/posters/1315772.jpg",
  },
  {
    id: "m06",
    tmdbId: 1273221,
    title: "무서운 영화",
    genre: "코미디",
    runtime: 96,
    posterUrl: "/posters/1273221.jpg",
  },
  {
    id: "m07",
    tmdbId: 840464,
    title: "그린랜드 2: 마이그레이션",
    genre: "스릴러",
    runtime: 98,
    posterUrl: "/posters/840464.jpg",
  },
  {
    id: "m08",
    tmdbId: 1368314,
    title: "패신저",
    genre: "공포",
    runtime: 94,
    posterUrl: "/posters/1368314.jpg",
  },
  {
    id: "m09",
    tmdbId: 1430077,
    title: "호컴",
    genre: "공포",
    runtime: 108,
    posterUrl: "/posters/1430077.jpg",
  },
  {
    id: "m10",
    tmdbId: 1266127,
    title: "레디 오어 낫: 죽음의 숨바꼭질",
    genre: "공포",
    runtime: 108,
    posterUrl: "/posters/1266127.jpg",
  },
  {
    id: "m11",
    tmdbId: 1317288,
    title: "마티 슈프림",
    genre: "스릴러",
    runtime: 150,
    posterUrl: "/posters/1317288.jpg",
  },
  {
    id: "m12",
    tmdbId: 1058424,
    title: "호프",
    genre: "스릴러",
    runtime: 156,
    posterUrl: "/posters/1058424.jpg",
  },
];

export const getMovie = (id: string) => MOVIES.find((m) => m.id === id);
