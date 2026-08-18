import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { getOrCreateWrap } from "@/lib/wrap-service";
import { isRateLimited } from "@/lib/rate-limit";
import WrapExperience from "@/components/wrap/WrapExperience";
import type { WrapData } from "@/lib/wrap-stats";

const USERNAME_PATTERN = /^[a-zA-Z0-9-]{1,39}$/;

async function loadWrap(username: string): Promise<{ wrap: WrapData | null; error: string | null }> {
  if (!USERNAME_PATTERN.test(username)) {
    return { wrap: null, error: "That doesn't look like a valid GitHub username." };
  }
  try {
    const wrap = await getOrCreateWrap(username);
    if (!wrap) return { wrap: null, error: `No GitHub user found for "${username}".` };
    return { wrap, error: null };
  } catch (err) {
    return { wrap: null, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const { wrap } = await loadWrap(username);
  if (!wrap) return { title: `${username} — CodeWrapped` };

  const title = `${wrap.login}'s CodeWrapped — ${wrap.personality.label}`;
  const description = `${wrap.totalContributions} contributions, a ${wrap.longestStreak}-day streak, top language ${
    wrap.topLanguages[0]?.name ?? "—"
  }. See @${wrap.login}'s GitHub year, wrapped.`;

  // openGraph/twitter don't inherit from the plain title/description above —
  // social platforms read these directly, so they need setting explicitly or
  // the link preview text stays the generic root layout copy.
  return {
    title,
    description,
    openGraph: { title, description },
    twitter: { title, description },
  };
}

export default async function WrapPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const identifier = forwardedFor ? forwardedFor.split(",")[0].trim() : (headersList.get("x-real-ip") ?? "unknown");
  if (isRateLimited(identifier)) {
    return <ErrorState message="Too many requests — please wait a moment and try again." />;
  }

  const { wrap, error } = await loadWrap(username);

  if (error || !wrap) {
    return <ErrorState message={error ?? "Something went wrong."} />;
  }

  return <WrapExperience wrap={wrap} />;
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
      <AlertTriangle className="h-8 w-8 text-orange-400" />
      <p className="text-sm text-white">{message}</p>
      <Link href="/" className="mt-2 text-xs text-pink-300 underline underline-offset-4">
        Try another username
      </Link>
    </div>
  );
}
