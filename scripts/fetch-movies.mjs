/**
 * 일회성 스크립트 — TMDB Now Playing(KR) 기준으로 src/data/movies.ts 와 public/posters/ 를 생성한다.
 *
 * 실행:
 *   TMDB_TOKEN=<read access token> node scripts/fetch-movies.mjs
 *   (PowerShell) $env:TMDB_TOKEN="<token>"; node scripts/fetch-movies.mjs
 *
 * 토큰은 환경변수로만 받는다. 소스에 하드코딩하지 말 것.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const TOKEN = process.env.TMDB_TOKEN;
if (!TOKEN) {
  console.error("TMDB_TOKEN 환경변수가 필요합니다.");
  process.exit(1);
}

const API = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w500";
const WANT = 12;
const ROOT = process.cwd();
const POSTER_DIR = path.join(ROOT, "public", "posters");

/** TMDB 장르 id → 프로젝트 Genre 타입. 앞쪽에 있을수록 우선 채택한다. */
const GENRE_PRIORITY = [
  [16, "애니메이션"],
  [27, "공포"],
  [10749, "로맨스"],
  [35, "코미디"],
  [53, "스릴러"],
  [9648, "스릴러"], // 미스터리
  [80, "스릴러"], // 범죄
  [28, "액션"],
  [12, "액션"], // 어드벤처
  [37, "액션"], // 서부
  [10752, "액션"], // 전쟁
  [878, "SF"],
  [14, "SF"], // 판타지 → 가장 가까운 SF
  [18, "드라마"],
  [36, "드라마"], // 역사
  [99, "드라마"], // 다큐멘터리
  [10402, "드라마"], // 음악
  [10770, "드라마"], // TV 영화
  [10751, "드라마"], // 가족
];

const toGenre = (ids = []) => {
  for (const [tmdbId, genre] of GENRE_PRIORITY) {
    if (ids.includes(tmdbId)) return genre;
  }
  return "드라마";
};

// v4 Read Access Token(JWT)은 Authorization 헤더, v3 API key는 쿼리 파라미터로 인증한다.
const IS_V4 = TOKEN.split(".").length === 3;

async function tmdb(pathname, params = {}) {
  const url = new URL(API + pathname);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  if (!IS_V4) url.searchParams.set("api_key", TOKEN);
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      ...(IS_V4 ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`TMDB ${pathname} 실패: ${res.status} ${await res.text()}`);
  return res.json();
}

async function downloadPoster(posterPath, fileName) {
  const res = await fetch(IMG + posterPath);
  if (!res.ok) throw new Error(`포스터 다운로드 실패: ${posterPath} (${res.status})`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 1024) throw new Error(`포스터가 비어 있음: ${posterPath}`);
  await writeFile(path.join(POSTER_DIR, fileName), buf);
  return buf.length;
}

const esc = (s) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

async function main() {
  await mkdir(POSTER_DIR, { recursive: true });

  // 후보 수집 (포스터 없는 작품 제외, 인기순 정렬)
  const seen = new Set();
  const candidates = [];
  for (const page of [1, 2, 3]) {
    const data = await tmdb("/movie/now_playing", { region: "KR", language: "ko-KR", page });
    for (const m of data.results ?? []) {
      if (!m.poster_path || seen.has(m.id)) continue;
      seen.add(m.id);
      candidates.push(m);
    }
  }
  candidates.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  console.log(`후보 ${candidates.length}편 수집`);

  // 상위부터 채우되, 포스터 다운로드가 실패하면 다음 상영작으로 교체한다
  const picked = [];
  for (const m of candidates) {
    if (picked.length >= WANT) break;
    const fileName = `${m.id}.jpg`;
    try {
      const size = await downloadPoster(m.poster_path, fileName);
      const detail = await tmdb(`/movie/${m.id}`, { language: "ko-KR" });
      const genreIds = (detail.genres ?? []).map((g) => g.id);
      picked.push({
        id: `m${String(picked.length + 1).padStart(2, "0")}`,
        tmdbId: m.id,
        title: (detail.title || m.title || "").trim(),
        genre: toGenre(genreIds.length ? genreIds : (m.genre_ids ?? [])),
        tmdbGenres: (detail.genres ?? []).map((g) => g.name).join("/"),
        runtime: detail.runtime && detail.runtime > 0 ? detail.runtime : 110,
        posterUrl: `/posters/${fileName}`,
        releaseDate: m.release_date ?? "",
      });
      console.log(`  ✓ ${m.title} (${Math.round(size / 1024)}KB)`);
    } catch (e) {
      console.warn(`  ✗ 제외: ${m.title} — ${e.message}`);
    }
  }

  if (picked.length < WANT) throw new Error(`${WANT}편을 채우지 못했습니다 (${picked.length}편)`);

  const body = picked
    .map(
      (m) => `  {
    id: "${m.id}",
    tmdbId: ${m.tmdbId},
    title: "${esc(m.title)}",
    genre: "${m.genre}",
    runtime: ${m.runtime},
    posterUrl: "${m.posterUrl}",
  },`,
    )
    .join("\n");

  const file = `import type { Movie } from "@/types";

/**
 * TMDB Now Playing(region=KR) 기준 실제 상영작 12편 — 데모 용도.
 * scripts/fetch-movies.mjs 로 자동 생성됨. 직접 수정하지 말 것.
 * 포스터 이미지는 public/posters/ 에 함께 저장된다.
 */
export const MOVIES: Movie[] = [
${body}
];

export const getMovie = (id: string) => MOVIES.find((m) => m.id === id);
`;

  await writeFile(path.join(ROOT, "src", "data", "movies.ts"), file, "utf8");
  console.log(`\nsrc/data/movies.ts 생성 완료 (${picked.length}편)`);
  for (const m of picked) {
    console.log(`${m.id}  ${m.title}  |  ${m.genre}  (TMDB: ${m.tmdbGenres})  ${m.runtime}분`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
