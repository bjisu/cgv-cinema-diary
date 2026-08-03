"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronRight, Image as ImageIcon, Ticket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import AppHeader from "@/components/layout/AppHeader";
import MobileContainer from "@/components/layout/MobileContainer";
import BottomSheet from "@/components/ui/BottomSheet";
import Poster from "@/components/ui/Poster";
import { BOOKINGS } from "@/data/bookings";
import { MOVIES, getMovie } from "@/data/movies";
import { formatWatchedAt, toDateInput, toTimeInput } from "@/lib/format";
import { useDraftStore } from "@/store/useDraftStore";
import { emptyDraft } from "@/store/useDraftStore";
import type { EntrySource } from "@/types";

const THEATERS = ["용산아이파크몰", "왕십리", "영등포", "여의도"];
const SCREENS = ["5관", "3관", "7관", "IMAX관"];

/** PRD §8 화면 03 — 영화표 인증 (FR-03, FR-04) */
export default function VerifyPage() {
  const router = useRouter();
  const setDraft = useDraftStore((s) => s.setDraft);

  const [scanning, setScanning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  /** 목데이터 1건을 뽑아 자동 기입값 생성 (FR-04 — 실패 케이스 없음) */
  const buildAutoDraft = (source: EntrySource) => {
    const movie = MOVIES[Math.floor(Math.random() * MOVIES.length)];
    const now = new Date();
    return {
      ...emptyDraft(),
      movieId: movie.id,
      genre: movie.genre,
      date: toDateInput(now.toISOString()),
      time: "19:20",
      theater: THEATERS[Math.floor(Math.random() * THEATERS.length)],
      screen: SCREENS[Math.floor(Math.random() * SCREENS.length)],
      seat: `H${10 + Math.floor(Math.random() * 8)}`,
      source,
      auto: true,
    };
  };

  const startScan = (file: File | undefined, source: EntrySource) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setScanning(true);
    timerRef.current = setTimeout(() => {
      setDraft(buildAutoDraft(source));
      router.push("/diary/verify/result");
    }, 2000);
  };

  return (
    <MobileContainer>
      <div className="min-h-screen pb-10">
        <AppHeader title="영화표로 기록" onBack={() => router.push("/diary")} />

        <p className="px-5 pt-2 text-body text-cgv-gray-600">기록 방법을 선택하세요</p>

        <ul className="mt-4 flex flex-col gap-3 px-5">
          <MethodCard
            icon={<Camera size={22} strokeWidth={1.8} />}
            title="종이 티켓 촬영"
            desc="티켓을 촬영하면 관람 정보를 자동으로 읽어와요"
            onClick={() => photoRef.current?.click()}
          />
          <MethodCard
            icon={<ImageIcon size={22} strokeWidth={1.8} />}
            title="모바일 영화표 업로드"
            desc="이미지에서 인식 · 갤러리에서 선택"
            onClick={() => mobileRef.current?.click()}
          />
          <MethodCard
            icon={<Ticket size={22} strokeWidth={1.8} />}
            title="CGV 예매내역 불러오기"
            desc="기존 실관람 등록과 연동"
            badge="가장 간편"
            onClick={() => setSheetOpen(true)}
          />
        </ul>

        <div className="px-5 pt-6">
          <button
            type="button"
            onClick={() => {
              setDraft({ ...emptyDraft(), source: "manual", auto: false });
              router.push("/diary/verify/result");
            }}
            className="text-sub text-cgv-gray-600 underline underline-offset-2"
          >
            직접 입력하기
          </button>
        </div>

        <input
          ref={photoRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => startScan(e.target.files?.[0], "photo")}
        />
        <input
          ref={mobileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => startScan(e.target.files?.[0], "mobile")}
        />
      </div>

      {/* 예매내역 목데이터 바텀시트 */}
      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="예매내역">
        <ul className="flex flex-col gap-3 pb-2">
          {BOOKINGS.map((b) => {
            const movie = getMovie(b.movieId);
            return (
              <li key={b.id}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-card bg-cgv-gray-100 p-3 text-left"
                  onClick={() => {
                    setDraft({
                      ...emptyDraft(),
                      movieId: b.movieId,
                      genre: movie?.genre ?? "",
                      date: toDateInput(b.watchedAt),
                      time: toTimeInput(b.watchedAt),
                      theater: b.theater,
                      screen: b.screen,
                      seat: b.seat,
                      source: "booking",
                      auto: true,
                    });
                    router.push("/diary/verify/result");
                  }}
                >
                  <Poster movieId={b.movieId} sizes="48px" className="w-[48px] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-bold text-cgv-black">{movie?.title}</p>
                    <p className="mt-1 text-sub text-cgv-gray-600">{formatWatchedAt(b.watchedAt)}</p>
                    <p className="mt-0.5 text-sub text-cgv-gray-400">
                      {b.theater} · {b.screen} · {b.seat}
                    </p>
                  </div>
                  <ChevronRight size={20} className="shrink-0 text-cgv-gray-400" />
                </button>
              </li>
            );
          })}
        </ul>
      </BottomSheet>

      {/* 스캔 연출 (FR-04) */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 px-8"
          >
            <div className="relative h-[240px] w-[170px] overflow-hidden rounded-card bg-cgv-white">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="영화표 미리보기" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-cgv-gray-100" />
              )}
              <motion.div
                initial={{ top: "0%" }}
                animate={{ top: ["0%", "96%", "0%"] }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-x-0 h-[3px] bg-cgv-red shadow-[0_0_12px_2px_rgba(255,41,73,0.8)]"
              />
            </div>
            <p className="mt-6 text-body text-cgv-white">영화표를 인식하고 있어요...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileContainer>
  );
}

function MethodCard({
  icon,
  title,
  desc,
  badge,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3.5 rounded-card bg-cgv-gray-100 p-4 text-left"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cgv-white text-cgv-black">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1.5">
            <span className="text-h2 font-bold text-cgv-black">{title}</span>
            {badge && <span className="text-[11px] font-bold text-cgv-red">{badge}</span>}
          </span>
          <span className="mt-1 block text-sub text-cgv-gray-600">{desc}</span>
        </span>
        <ChevronRight size={20} className="shrink-0 text-cgv-gray-400" />
      </button>
    </li>
  );
}
