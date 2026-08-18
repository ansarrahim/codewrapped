import { redis } from "./redis";
import type { WrapData } from "./wrap-stats";

const TTL_SECONDS = 60 * 60 * 6;

function isConfigured(): boolean {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function key(username: string): string {
  return `wrap:${username.toLowerCase()}`;
}

export async function getCachedWrap(username: string): Promise<WrapData | null> {
  if (!isConfigured()) return null;
  try {
    return await redis.get<WrapData>(key(username));
  } catch (err) {
    console.error("getCachedWrap error:", err);
    return null;
  }
}

export async function setCachedWrap(username: string, data: WrapData): Promise<void> {
  if (!isConfigured()) return;
  try {
    await redis.set(key(username), data, { ex: TTL_SECONDS });
  } catch (err) {
    console.error("setCachedWrap error:", err);
  }
}
