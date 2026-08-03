/** 극장 운영 시간 — 이 범위를 벗어난 관람 시간은 기록할 수 없다. */
export const OPEN_TIME = "08:00";
export const CLOSE_TIME = "23:59";

const toMinutes = (hhmm: string): number | null => {
  const m = /^(\d{2}):(\d{2})$/.exec(hhmm);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
};

/** 운영 시간(08:00~23:59) 내인지 */
export function isWithinOperatingHours(time: string): boolean {
  const t = toMinutes(time);
  if (t === null) return false;
  return t >= toMinutes(OPEN_TIME)! && t <= toMinutes(CLOSE_TIME)!;
}

/** `<input type="date">` 의 max — 오늘 이후(미래)는 선택할 수 없다. */
export function todayInputValue(now: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** 미래 날짜 여부 (yyyy-mm-dd 문자열 비교) */
export function isFutureDate(date: string, now: Date = new Date()): boolean {
  return date > todayInputValue(now);
}
