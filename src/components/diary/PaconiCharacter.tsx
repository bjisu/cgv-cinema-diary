import Image from "next/image";
import { getPaconyImage } from "@/data/levels";

/**
 * 파코니 캐릭터 (PRD §5.1) — 실제 파코니 에셋(`public/pacony.png`)을 사용한다.
 * 레벨별 이미지 교체는 `src/data/levels.ts` 의 `PACONY_IMAGE_BY_LEVEL` 한 곳만 고치면 된다.
 *
 * `size` 는 캐릭터가 차지하는 정사각 박스의 한 변(px). 이미지는 `object-contain` 이라
 * 원본 비율을 유지한 채 박스 안에 들어간다(찌그러지지 않음).
 */
export default function PaconiCharacter({
  level,
  size = 120,
  className = "",
  priority = false,
}: {
  level: number;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={getPaconyImage(level)}
      alt={`파코니 레벨 ${level}`}
      width={size}
      height={size}
      priority={priority}
      style={{ width: size, height: size }}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}

/** 더보기 아바타 우하단 미니 뱃지 (FR-12) */
export function PaconiMiniBadge({ level }: { level: number }) {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 flex items-center gap-0.5 rounded-full border-2 border-cgv-white bg-cgv-red pl-0.5 pr-1.5 py-0.5">
      <PaconiCharacter level={level} size={14} />
      <span className="text-[10px] font-bold leading-none text-cgv-white">Lv.{level}</span>
    </span>
  );
}
