import { RateLimiter } from "../../../src/utils/rateLimiter";

describe("RateLimiter", () => {
  it("should execute requests sequentially", async () => {
    const limiter = new RateLimiter(50);
    const order: number[] = [];

    const p1 = limiter.enqueue(async () => {
      order.push(1);
      return 1;
    });
    const p2 = limiter.enqueue(async () => {
      order.push(2);
      return 2;
    });
    const p3 = limiter.enqueue(async () => {
      order.push(3);
      return 3;
    });

    const results = await Promise.all([p1, p2, p3]);
    expect(results).toEqual([1, 2, 3]);
    expect(order).toEqual([1, 2, 3]);
  });

  it("should respect minimum interval between requests", async () => {
    const minInterval = 100;
    const limiter = new RateLimiter(minInterval);
    const timestamps: number[] = [];

    const p1 = limiter.enqueue(async () => {
      timestamps.push(Date.now());
      return 1;
    });
    const p2 = limiter.enqueue(async () => {
      timestamps.push(Date.now());
      return 2;
    });
    const p3 = limiter.enqueue(async () => {
      timestamps.push(Date.now());
      return 3;
    });

    await Promise.all([p1, p2, p3]);

    for (let i = 1; i < timestamps.length; i++) {
      const diff = timestamps[i] - timestamps[i - 1];
      expect(diff).toBeGreaterThanOrEqual(minInterval - 10);
    }
  });

  it("should propagate errors from the callback", async () => {
    const limiter = new RateLimiter(50);

    await expect(
      limiter.enqueue(async () => {
        throw new Error("test error");
      })
    ).rejects.toThrow("test error");
  });

  it("should continue processing after an error", async () => {
    const limiter = new RateLimiter(50);

    const p1 = limiter.enqueue(async () => {
      throw new Error("fail");
    });
    const p2 = limiter.enqueue(async () => "success");

    await expect(p1).rejects.toThrow("fail");
    await expect(p2).resolves.toBe("success");
  });
});
