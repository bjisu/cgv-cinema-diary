import { getMovie } from "@/data/movies";

/**
 * 저작권 이슈 회피 (PRD §5.3) — 실제 포스터 대신 CSS 그라데이션 + 가상 타이틀로 생성.
 */
export default function Poster({
  movieId,
  className = "",
  size = "md",
}: {
  movieId: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const movie = getMovie(movieId);
  const from = movie?.poster.from ?? "#3F3F46";
  const to = movie?.poster.to ?? "#A1A1AA";

  const scale = {
    sm: { title: "text-[9px]", tag: "text-[5px]", pad: "p-1.5" },
    md: { title: "text-[11px]", tag: "text-[6px]", pad: "p-2" },
    lg: { title: "text-[13px]", tag: "text-[7px]", pad: "p-2.5" },
  }[size];

  return (
    <div
      className={`relative flex aspect-[2/3] flex-col justify-end overflow-hidden rounded-[6px] ${scale.pad} ${className}`}
      style={{ backgroundImage: `linear-gradient(160deg, ${from} 0%, ${to} 100%)` }}
    >
      <span className={`${scale.tag} font-bold uppercase tracking-[0.12em] text-white/70`}>
        {movie?.poster.tagline}
      </span>
      <span className={`${scale.title} font-bold leading-tight text-white`}>{movie?.title}</span>
    </div>
  );
}
