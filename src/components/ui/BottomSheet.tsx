"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

/** PRD §7.3 — 상단 radius 20px, 핸들바 36×4 #D9D9D9, 딤 rgba(0,0,0,0.5), slide-up 300ms */
export default function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-x-0 bottom-0 mx-auto max-h-[80vh] w-full max-w-mobile overflow-y-auto rounded-t-sheet bg-cgv-white pb-[calc(20px+env(safe-area-inset-bottom))]"
          >
            <div className="sticky top-0 bg-cgv-white pt-2.5">
              <div className="mx-auto h-1 w-9 rounded-full bg-[#D9D9D9]" />
              {title && <h2 className="px-5 pb-2 pt-4 text-h2 font-bold text-cgv-black">{title}</h2>}
            </div>
            <div className="px-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
