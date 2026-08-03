import Image from "next/image";
import { getMovie } from "@/data/movies";

/** TMDB 포스터(public/posters/*.jpg)를 2:3 비율로 표시한다. */
export default function Poster({
  movieId,
  className = "",
  sizes = "160px",
}: {
  movieId: string;
  className?: string;
  /** 표시 폭 힌트 (next/image 최적화용) */
  sizes?: string;
}) {
  const movie = getMovie(movieId);

  if (!movie) {
    return (
      <div className={`aspect-[2/3] overflow-hidden rounded-[6px] bg-cgv-gray-100 ${className}`} />
    );
  }

  return (
    <div
      className={`relative aspect-[2/3] overflow-hidden rounded-[6px] bg-cgv-gray-100 ${className}`}
    >
      <Image
        src={movie.posterUrl}
        alt={`${movie.title} 포스터`}
        fill
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
