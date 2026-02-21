import axios from "axios";
import { config } from "../config";
import { rateLimiter } from "../utils/rateLimiter";

const client = axios.create({
  baseURL: config.musicbrainz.baseUrl,
  timeout: config.musicbrainz.timeoutMs,
  headers: {
    "User-Agent": config.musicbrainz.userAgent,
    Accept: "application/json",
  },
  params: {
    fmt: "json",
  },
});

export async function mbGet<T>(
  path: string,
  params?: Record<string, string | number>
): Promise<T> {
  return rateLimiter.enqueue(async () => {
    const response = await client.get<T>(path, { params });
    return response.data;
  });
}
