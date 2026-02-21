export const config = {
  port: Number(process.env.PORT) || 3000,
  musicbrainz: {
    baseUrl: "https://musicbrainz.org/ws/2",
    userAgent: "MetalSetlistBuilder/1.0.0 (contact@email.com)",
    timeoutMs: 10000,
  },
  cache: {
    defaultTTLSeconds: 3600,
  },
  cors: {
    origin: process.env.CORS_ORIGIN || "*",
  },
  rateLimiter: {
    minIntervalMs: 1100,
  },
};
