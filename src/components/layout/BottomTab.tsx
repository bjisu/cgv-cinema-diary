"use client";

import { Clapperboard, Home, Popcorn } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type TabKey = "home" | "cinetalk" | "store" | "more";

const TABS: { key: TabKey; label: string; href: string }[] = [
  { key: "home", label: "홈", href: "/home" },
  { key: "cinetalk", label: "씨네톡", href: "/cinetalk" },
  { key: "store", label: "매점", href: "/store" },
  { key: "more", label: "더보기", href: "/more" },
];

/** 더보기 아이콘 — 스크린샷의 '사람 + 줄' 형태 (lucide에 동일 아이콘 없어 직접 작도) */
function MoreIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden>
      <circle cx="9.5" cy="7.5" r="3.4" stroke="#121212" strokeWidth="1.8" />
      <path
        d="M3.6 19.4c0-3.4 2.7-5.6 5.9-5.6s5.9 2.2 5.9 5.6"
        stroke="#121212"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M18.6 8h4.2M18.6 12h4.2M18.6 16h4.2"
        stroke="#121212"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TabIcon({ tab }: { tab: TabKey }) {
  if (tab === "home") return <Home size={26} strokeWidth={1.8} className="text-cgv-black" />;
  if (tab === "cinetalk")
    return <Clapperboard size={26} strokeWidth={1.8} className="text-cgv-black" />;
  if (tab === "store") return <Popcorn size={26} strokeWidth={1.8} className="text-cgv-black" />;
  return <MoreIcon />;
}

/**
 * PRD §7.3 / FR-11 — 하단 탭바.
 * 탭 4개 + 중앙 '예매·예약' 빨간 FAB(지름 72px, 탭바 위로 절반 돌출).
 * 아이콘·라벨은 활성/비활성 모두 검정, 활성 탭만 라벨 Bold.
 */
export default function BottomTab({ active }: { active?: TabKey | "booking" }) {
  const pathname = usePathname();
  const router = useRouter();
  const current = active ?? TABS.find((t) => pathname.startsWith(t.href))?.key;

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
      <div className="pointer-events-auto relative mx-auto w-full max-w-mobile">
        {/* 중앙 FAB — 탭바 위로 돌출 */}
        <button
          type="button"
          onClick={() => router.push("/booking")}
          aria-label="예매·예약"
          className="absolute left-1/2 top-0 z-10 flex h-[72px] w-[72px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-cgv-fab text-cgv-white shadow-[0_4px_12px_rgba(255,41,73,0.32)] active:bg-cgv-red-deep"
        >
          <span className="text-[13px] font-bold leading-[16px]">예매·예약</span>
        </button>

        <div className="border-t border-black/5 bg-[#F7F7F7] pb-[env(safe-area-inset-bottom)]">
          <ul className="flex h-[64px] items-center">
            {TABS.map((tab, i) => (
              <li key={tab.key} className="flex flex-1 justify-center">
                {/* 중앙 FAB 자리 확보 */}
                {i === 2 && <span className="w-[72px] shrink-0" aria-hidden />}
                <Link
                  href={tab.href}
                  className="flex h-[64px] flex-1 flex-col items-center justify-center gap-[3px]"
                >
                  <TabIcon tab={tab.key} />
                  <span
                    className={`text-caption text-cgv-black ${
                      current === tab.key ? "font-bold" : "font-normal"
                    }`}
                  >
                    {tab.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
