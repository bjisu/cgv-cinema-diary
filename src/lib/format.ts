const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

const toDate = (iso: string) => new Date(iso);

/** `8/2 (토) 19:20` */
export function formatWatchedAt(iso: string): string {
  const d = toDate(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getMonth() + 1}/${d.getDate()} (${WEEKDAYS[d.getDay()]}) ${pad(d.getHours())}:${pad(
    d.getMinutes(),
  )}`;
}

/** `2026.08.02` */
export function formatDate(iso: string): string {
  const d = toDate(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
}

/** 아카이브 스탬프용 `8.2` */
export function formatStamp(iso: string): string {
  const d = toDate(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getMonth() + 1}.${d.getDate()}`;
}

/** `<input type="date">` 값 */
export function toDateInput(iso: string): string {
  const d = toDate(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** `<input type="time">` 값 */
export function toTimeInput(iso: string): string {
  const d = toDate(iso);
  if (Number.isNaN(d.getTime())) return "";
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** date + time 입력값 → 저장용 ISO (로컬 기준, 초 없음) */
export function fromDateTimeInput(date: string, time: string): string {
  return `${date}T${time || "00:00"}`;
}

export function getYear(iso: string): number {
  return toDate(iso).getFullYear();
}

export function getMonth(iso: string): number {
  return toDate(iso).getMonth() + 1;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}
