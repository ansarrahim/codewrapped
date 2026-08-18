# CodeWrapped

Enter any public GitHub username, get a shareable, animated wrap of their coding year — top languages, longest streak, most active repo, and a personality label pulled from real contribution data.

**Live:** https://codewrapped.vercel.app

## Why it's real, not a mock

- Every stat comes from GitHub's GraphQL API (`contributionsCollection`, per-repo languages) — no fabricated numbers, no placeholder "coming soon" data.
- The personality label (e.g. "Weekend Warrior," "The Specialist") is derived from a small rules table over the actual computed stats, not arbitrary.
- Results are cached in Upstash Redis for 6 hours so repeat/popular lookups are instant and GitHub's rate limit isn't burned on every page view.

## The viral mechanic

`/u/[username]/opengraph-image` is a per-user dynamic Open Graph image (`next/og`). When a result page is shared anywhere — X, LinkedIn, Discord, iMessage — the link preview itself renders that person's personalized card. That's the difference between "download and repost" (weak) and the link itself being the shareable artifact (works).

## Stack

Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Upstash Redis. Deployed on Vercel.

## Local development

```bash
npm install
cp .env.example .env.local   # GITHUB_TOKEN (no scopes needed) + Upstash credentials
npm run dev
```
