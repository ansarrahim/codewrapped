import { NextResponse } from "next/server";
import { getOrCreateWrap } from "@/lib/wrap-service";
import { isRateLimited } from "@/lib/rate-limit";

export const runtime = "nodejs";

const USERNAME_PATTERN = /^[a-zA-Z0-9-]{1,39}$/;

function getClientIdentifier(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(request: Request, { params }: { params: Promise<{ username: string }> }) {
  const identifier = getClientIdentifier(request);
  if (isRateLimited(identifier)) {
    return NextResponse.json(
      { error: "Too many requests — please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": "30" } }
    );
  }

  const { username } = await params;

  if (!USERNAME_PATTERN.test(username)) {
    return NextResponse.json({ error: "That doesn't look like a valid GitHub username." }, { status: 400 });
  }

  try {
    const wrap = await getOrCreateWrap(username);
    if (!wrap) {
      return NextResponse.json({ error: `No GitHub user found for "${username}".` }, { status: 404 });
    }
    return NextResponse.json({ wrap });
  } catch (error) {
    console.error("wrap generation error:", error);
    const message = error instanceof Error ? error.message : "Couldn't reach GitHub right now. Please try again shortly.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
