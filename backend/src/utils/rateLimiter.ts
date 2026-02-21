import { config } from "../config";

class RateLimiter {
  private queue: Array<{
    fn: () => Promise<unknown>;
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
  }> = [];
  private processing = false;
  private lastRequestTime = 0;
  private minInterval: number;

  constructor(minIntervalMs?: number) {
    this.minInterval = minIntervalMs ?? config.rateLimiter.minIntervalMs;
  }

  enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        fn: fn as () => Promise<unknown>,
        resolve: resolve as (value: unknown) => void,
        reject,
      });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift()!;

      const now = Date.now();
      const elapsed = now - this.lastRequestTime;
      if (elapsed < this.minInterval) {
        await this.delay(this.minInterval - elapsed);
      }

      try {
        this.lastRequestTime = Date.now();
        const result = await item.fn();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
    }

    this.processing = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const rateLimiter = new RateLimiter();
export { RateLimiter };
