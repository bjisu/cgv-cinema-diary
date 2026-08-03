/**
 * 파코니 캐릭터 (PRD §5.1) — 실제 파코니 에셋 사용 금지이므로 팝콘 캐릭터를 SVG로 직접 제작.
 * 레벨이 오를수록 커지고 장식이 추가된다. 컬러는 §7.1 토큰만 사용.
 */
export default function PaconiCharacter({
  level,
  size = 120,
  className = "",
}: {
  level: number;
  size?: number;
  className?: string;
}) {
  // 레벨에 따라 살짝 커짐 (Lv.0 기준 0.86배 → Lv.6 1.0배)
  const grow = 0.86 + Math.min(level, 6) * 0.024;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      className={className}
      role="img"
      aria-label={`파코니 레벨 ${level}`}
    >
      <g transform={`translate(60 62) scale(${grow}) translate(-60 -62)`}>
        {/* Lv.6 후광 */}
        {level >= 6 && <circle cx="60" cy="60" r="46" fill="#F5C518" opacity="0.16" />}

        {/* 팝콘 알갱이 */}
        <g>
          <circle cx="44" cy="36" r="12" fill="#F5C518" />
          <circle cx="60" cy="28" r="13" fill="#FFF6D6" />
          <circle cx="76" cy="36" r="12" fill="#F5C518" />
          <circle cx="52" cy="26" r="9" fill="#FFF6D6" />
          <circle cx="70" cy="26" r="9" fill="#F5C518" />
        </g>

        {/* Lv.2 새싹 */}
        {level >= 2 && (
          <path
            d="M60 17c0-6 5-9 9-9 0 6-4 9-9 9z"
            fill="#FF7553"
          />
        )}

        {/* Lv.5+ 별 장식 */}
        {level >= 5 && (
          <path
            d="M92 22l2.4 5 5.6.7-4 3.9 1 5.5-5-2.6-5 2.6 1-5.5-4-3.9 5.6-.7z"
            fill="#F5C518"
          />
        )}

        {/* 컵 (CGV 레드 스트라이프) */}
        <path d="M36 44h48l-6 44a6 6 0 0 1-6 5H48a6 6 0 0 1-6-5z" fill="#FFFFFF" />
        <path d="M36 44h48l-6 44a6 6 0 0 1-6 5H48a6 6 0 0 1-6-5z" fill="#F4F4F4" opacity="0.6" />
        <g clipPath="url(#cup)">
          <rect x="42" y="44" width="8" height="50" fill="#FF2949" />
          <rect x="58" y="44" width="8" height="50" fill="#FF2949" />
          <rect x="74" y="44" width="8" height="50" fill="#FF2949" />
        </g>
        <defs>
          <clipPath id="cup">
            <path d="M36 44h48l-6 44a6 6 0 0 1-6 5H48a6 6 0 0 1-6-5z" />
          </clipPath>
        </defs>
        <path
          d="M36 44h48l-6 44a6 6 0 0 1-6 5H48a6 6 0 0 1-6-5z"
          stroke="#121212"
          strokeWidth="2.4"
          fill="none"
        />

        {/* 얼굴 */}
        <ellipse cx="52" cy="62" rx="3.2" ry="3.8" fill="#121212" />
        <ellipse cx="68" cy="62" rx="3.2" ry="3.8" fill="#121212" />
        <path
          d={level >= 3 ? "M53 71q7 7 14 0" : "M55 71q5 4 10 0"}
          stroke="#121212"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Lv.4+ 볼터치 */}
        {level >= 4 && (
          <>
            <circle cx="45" cy="69" r="3" fill="#FF406C" opacity="0.5" />
            <circle cx="75" cy="69" r="3" fill="#FF406C" opacity="0.5" />
          </>
        )}

        {/* Lv.6 왕관 */}
        {level >= 6 && (
          <path
            d="M46 16l5 7 9-10 9 10 5-7 2 12H44z"
            fill="#F5C518"
            stroke="#121212"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        )}
      </g>
    </svg>
  );
}

/** 더보기 아바타 우하단 미니 뱃지 (FR-12) */
export function PaconiMiniBadge({ level }: { level: number }) {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 flex items-center gap-0.5 rounded-full border-2 border-cgv-white bg-cgv-red px-1.5 py-0.5">
      <span className="text-[10px] font-bold leading-none text-cgv-white">Lv.{level}</span>
    </span>
  );
}
