import type { Booking } from "@/types";

/** PRD §5.3 — CGV 예매내역 목데이터 3건 (FR-03 ③ '예매내역 불러오기') */
export const BOOKINGS: Booking[] = [
  {
    id: "b01",
    movieId: "m02",
    watchedAt: "2026-08-01T20:10",
    theater: "용산아이파크몰",
    screen: "IMAX관",
    seat: "F09",
  },
  {
    id: "b02",
    movieId: "m05",
    watchedAt: "2026-07-26T14:30",
    theater: "왕십리",
    screen: "3관",
    seat: "C11",
  },
  {
    id: "b03",
    movieId: "m09",
    watchedAt: "2026-07-19T21:40",
    theater: "영등포",
    screen: "7관",
    seat: "J14",
  },
];
