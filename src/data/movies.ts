import type { Movie } from "@/types";

/**
 * PRD §5.3 — 가상 영화 12편.
 * 실제 영화 제목·포스터 사용 금지. 포스터는 CSS 그라데이션 + 타이틀로 직접 생성.
 */
export const MOVIES: Movie[] = [
  {
    id: "m01",
    title: "미드나잇 시티",
    genre: "액션",
    runtime: 128,
    poster: { from: "#1F2937", to: "#FF2949", tagline: "MIDNIGHT CITY" },
  },
  {
    id: "m02",
    title: "별의 저편",
    genre: "SF",
    runtime: 141,
    poster: { from: "#0F172A", to: "#4C6EF5", tagline: "BEYOND THE STARS" },
  },
  {
    id: "m03",
    title: "여름의 온도",
    genre: "로맨스",
    runtime: 112,
    poster: { from: "#FF7553", to: "#FF406C", tagline: "SUMMER DEGREES" },
  },
  {
    id: "m04",
    title: "그날의 편지",
    genre: "드라마",
    runtime: 124,
    poster: { from: "#3F3F46", to: "#A1A1AA", tagline: "THE LETTER" },
  },
  {
    id: "m05",
    title: "팝콘 대소동",
    genre: "코미디",
    runtime: 98,
    poster: { from: "#F5C518", to: "#FF7553", tagline: "POPCORN RIOT" },
  },
  {
    id: "m06",
    title: "침묵의 계단",
    genre: "스릴러",
    runtime: 118,
    poster: { from: "#111827", to: "#374151", tagline: "SILENT STAIRS" },
  },
  {
    id: "m07",
    title: "구름 위 우체국",
    genre: "애니메이션",
    runtime: 104,
    poster: { from: "#60A5FA", to: "#C4B5FD", tagline: "CLOUD POST" },
  },
  {
    id: "m08",
    title: "새벽 3시의 손님",
    genre: "공포",
    runtime: 96,
    poster: { from: "#18181B", to: "#7F1D1D", tagline: "3AM GUEST" },
  },
  {
    id: "m09",
    title: "라스트 러너",
    genre: "액션",
    runtime: 133,
    poster: { from: "#7C2D12", to: "#FF2949", tagline: "LAST RUNNER" },
  },
  {
    id: "m10",
    title: "궤도의 아이들",
    genre: "SF",
    runtime: 137,
    poster: { from: "#1E1B4B", to: "#0EA5E9", tagline: "ORBIT KIDS" },
  },
  {
    id: "m11",
    title: "만두 가족",
    genre: "드라마",
    runtime: 109,
    poster: { from: "#78350F", to: "#F5C518", tagline: "DUMPLING FAMILY" },
  },
  {
    id: "m12",
    title: "네가 웃는 계절",
    genre: "로맨스",
    runtime: 107,
    poster: { from: "#BE185D", to: "#FDA4AF", tagline: "SEASON OF SMILE" },
  },
];

export const getMovie = (id: string) => MOVIES.find((m) => m.id === id);
