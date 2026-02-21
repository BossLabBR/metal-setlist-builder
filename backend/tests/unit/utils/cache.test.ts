import { MemoryCache } from "../../../src/utils/cache";

describe("MemoryCache", () => {
  let cache: MemoryCache;

  beforeEach(() => {
    cache = new MemoryCache(60);
  });

  it("should return null for a non-existent key", () => {
    expect(cache.get("missing")).toBeNull();
  });

  it("should store and retrieve a value", () => {
    cache.set("key1", { data: "hello" });
    expect(cache.get("key1")).toEqual({ data: "hello" });
  });

  it("should return null and remove entry after TTL expires", () => {
    jest.useFakeTimers();

    cache.set("key1", "value", 1);
    expect(cache.get("key1")).toBe("value");

    jest.advanceTimersByTime(1100);
    expect(cache.get("key1")).toBeNull();

    jest.useRealTimers();
  });

  it("should support custom TTL per entry", () => {
    jest.useFakeTimers();

    cache.set("short", "a", 1);
    cache.set("long", "b", 10);

    jest.advanceTimersByTime(2000);

    expect(cache.get("short")).toBeNull();
    expect(cache.get("long")).toBe("b");

    jest.useRealTimers();
  });

  it("should overwrite existing entries", () => {
    cache.set("key1", "old");
    cache.set("key1", "new");
    expect(cache.get("key1")).toBe("new");
  });
});
