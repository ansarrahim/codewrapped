import { fetchGithubUser } from "./github";
import { computeWrapData, type WrapData } from "./wrap-stats";
import { getCachedWrap, setCachedWrap } from "./wrap-cache";

export async function getOrCreateWrap(username: string): Promise<WrapData | null> {
  const cached = await getCachedWrap(username);
  if (cached) return cached;

  if (!process.env.GITHUB_TOKEN) {
    throw new Error("CodeWrapped isn't connected to GitHub yet. Add GITHUB_TOKEN to .env.local and restart.");
  }

  const raw = await fetchGithubUser(username);
  if (!raw) return null;

  const wrap = computeWrapData(raw);
  await setCachedWrap(username, wrap);
  return wrap;
}
