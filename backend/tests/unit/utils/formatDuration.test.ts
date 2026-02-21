import { formatDuration } from "../../../src/utils/formatDuration";

describe("formatDuration", () => {
  it("should convert 290000ms to '4:50'", () => {
    expect(formatDuration(290000)).toBe("4:50");
  });

  it("should convert 60000ms to '1:00'", () => {
    expect(formatDuration(60000)).toBe("1:00");
  });

  it("should convert 5000ms to '0:05'", () => {
    expect(formatDuration(5000)).toBe("0:05");
  });

  it("should return null for null input", () => {
    expect(formatDuration(null)).toBeNull();
  });

  it("should return null for undefined input", () => {
    expect(formatDuration(undefined)).toBeNull();
  });

  it("should convert 0 to '0:00'", () => {
    expect(formatDuration(0)).toBe("0:00");
  });

  it("should return null for NaN", () => {
    expect(formatDuration(NaN)).toBeNull();
  });
});
