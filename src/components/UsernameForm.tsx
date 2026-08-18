"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export default function UsernameForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = username.trim().replace(/^@/, "");
    if (!trimmed || isSubmitting) return;
    setIsSubmitting(true);
    router.push(`/u/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="your-github-username"
        maxLength={39}
        autoFocus
        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white outline-none backdrop-blur-sm placeholder:text-white/40 focus:border-pink-400/60 focus-visible:ring-2 focus-visible:ring-pink-400/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0221]"
      />
      <button
        type="submit"
        disabled={isSubmitting || !username.trim()}
        className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-transform active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
        style={{ background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #fb923c 100%)" }}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        Wrap it up
      </button>
    </form>
  );
}
