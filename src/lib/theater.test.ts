import { describe, expect, it } from "vitest";
import { isFutureDate, isWithinOperatingHours, todayInputValue } from "./theater";

describe("isWithinOperatingHours", () => {
  it("운영 시간 안이면 통과한다", () => {
    expect(isWithinOperatingHours("08:00")).toBe(true);
    expect(isWithinOperatingHours("19:20")).toBe(true);
    expect(isWithinOperatingHours("23:59")).toBe(true);
  });

  it("운영 시간 밖이면 막는다", () => {
    expect(isWithinOperatingHours("07:59")).toBe(false);
    expect(isWithinOperatingHours("03:00")).toBe(false);
    expect(isWithinOperatingHours("00:00")).toBe(false);
  });

  it("형식이 잘못되면 막는다", () => {
    expect(isWithinOperatingHours("")).toBe(false);
    expect(isWithinOperatingHours("9:00")).toBe(false);
    expect(isWithinOperatingHours("25:00")).toBe(false);
  });
});

describe("isFutureDate", () => {
  const now = new Date("2026-08-03T12:00");

  it("오늘까지는 허용한다", () => {
    expect(isFutureDate("2026-08-03", now)).toBe(false);
    expect(isFutureDate("2026-07-20", now)).toBe(false);
  });

  it("내일 이후는 막는다", () => {
    expect(isFutureDate("2026-08-04", now)).toBe(true);
    expect(isFutureDate("2027-01-01", now)).toBe(true);
  });

  it("todayInputValue 는 input[type=date] 형식이다", () => {
    expect(todayInputValue(now)).toBe("2026-08-03");
  });
});
