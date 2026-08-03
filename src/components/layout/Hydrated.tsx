"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * zustand persist는 클라이언트에서만 복원되므로, localStorage 상태에 의존하는 화면은
 * 마운트 이후에 렌더해 SSR hydration 불일치를 막는다. (NFR-05)
 */
export default function Hydrated({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return <>{mounted ? children : fallback}</>;
}
