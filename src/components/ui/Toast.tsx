"use client";

import { AnimatePresence, motion } from "framer-motion";
import { create } from "zustand";

interface ToastState {
  message: string | null;
  show: (message: string) => void;
  hide: () => void;
}

let timer: ReturnType<typeof setTimeout> | null = null;

export const useToast = create<ToastState>((set) => ({
  message: null,
  show: (message) => {
    set({ message });
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => set({ message: null }), 2200);
  },
  hide: () => set({ message: null }),
}));

/** PRD §7.3 — 하단 탭바 위 72px, 검정 90% pill, 흰 13px */
export default function ToastHost() {
  const message = useToast((s) => s.message);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="pointer-events-none fixed inset-x-0 bottom-[72px] z-[60] flex justify-center px-5"
        >
          <div className="max-w-mobile rounded-full bg-black/90 px-4 py-2.5 text-sub text-cgv-white">
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
