/**
 * PRD §7.3 GradeBar — 다크 트랙(높이 24px, radius full) + 좌측 그라데이션 pill.
 * 더보기 등급 진행바와 다이어리 레벨 진행바가 이 컴포넌트를 공유한다.
 */
export default function GradeBar({
  pillLabel,
  leftLabel,
  rightLabel,
  ratio = 0,
}: {
  pillLabel: string;
  leftLabel?: string;
  rightLabel?: string;
  /** 0~1 — pill이 트랙을 채우는 비율 */
  ratio?: number;
}) {
  // pill 최소 폭(라벨 가독성) 확보
  const width = `calc(${Math.min(100, Math.max(0, ratio * 100))}% + 64px)`;

  return (
    <div>
      <div className="relative h-6 w-full overflow-hidden rounded-full bg-cgv-bar-dark">
        <div
          className="flex h-full max-w-full items-center rounded-full bg-cgv-grad pl-3"
          style={{ width }}
        >
          <span className="text-sub font-bold text-cgv-white">{pillLabel}</span>
        </div>
      </div>
      {(leftLabel || rightLabel) && (
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-body text-cgv-gray-600">{leftLabel}</span>
          <span className="text-body text-cgv-gray-400">{rightLabel}</span>
        </div>
      )}
    </div>
  );
}
