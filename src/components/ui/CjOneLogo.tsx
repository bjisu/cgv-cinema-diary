/** CJ ONE 목업 로고 — 원본 에셋 미사용, 스크린샷의 다색 원형 형태만 재현 */
export default function CjOneLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <circle cx="14" cy="9" r="6" fill="#7C3AED" opacity="0.85" />
      <circle cx="9" cy="17" r="6" fill="#F5C518" opacity="0.85" />
      <circle cx="19" cy="17" r="6" fill="#0EA5E9" opacity="0.85" />
      <circle cx="14" cy="14" r="4.4" fill="#FFFFFF" />
    </svg>
  );
}
