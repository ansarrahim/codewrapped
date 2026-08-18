"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Flame,
  Share2,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import type { WrapData } from "@/lib/wrap-stats";
import { SLIDE_GRADIENTS } from "@/lib/slide-theme";

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const SLIDE_DURATION_MS = 5000;
const SLIDE_COUNT = 6;

export default function WrapExperience({ wrap }: { wrap: WrapData }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!wrap || paused) return;
    const interval = setInterval(() => {
      setIndex((prev) => Math.min(prev + 1, SLIDE_COUNT - 1));
    }, SLIDE_DURATION_MS);
    return () => clearInterval(interval);
  }, [wrap, paused, index]);

  function goNext() {
    setPaused(true);
    setIndex((prev) => Math.min(prev + 1, SLIDE_COUNT - 1));
  }

  function goPrev() {
    setPaused(true);
    setIndex((prev) => Math.max(prev - 1, 0));
  }

  return (
    <div className="relative flex flex-1 flex-col">
      <div className="flex gap-1.5 px-4 pt-4 sm:px-6">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <motion.div
              className="h-full bg-white"
              initial={{ width: i < index ? "100%" : "0%" }}
              animate={{ width: i < index ? "100%" : i === index ? "100%" : "0%" }}
              transition={i === index && !paused ? { duration: SLIDE_DURATION_MS / 1000, ease: "linear" } : { duration: 0.2 }}
            />
          </div>
        ))}
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-8 sm:px-6">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous slide"
          className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/5 p-2 text-white/50 backdrop-blur-sm transition-colors hover:text-white sm:left-6"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next slide"
          className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/5 p-2 text-white/50 backdrop-blur-sm transition-colors hover:text-white sm:right-6"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
            className="flex w-full max-w-md flex-col items-center rounded-3xl p-10 text-center"
            style={{ background: SLIDE_GRADIENTS[index] }}
          >
            <SlideContent index={index} wrap={wrap} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SlideContent({ index, wrap }: { index: number; wrap: WrapData }) {
  const displayName = wrap.name ?? wrap.login;

  switch (index) {
    case 0:
      return (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            @{wrap.login}&apos;s year in code
          </p>
          <p className="mt-6 font-mono text-6xl font-bold text-white">{wrap.totalContributions}</p>
          <p className="mt-2 text-sm text-white/80">total contributions this year</p>
          <p className="mt-8 text-xs text-white/60">
            {wrap.totalCommits} commits &middot; {wrap.totalPRs} pull requests &middot; {wrap.totalIssues} issues
          </p>
        </>
      );
    case 1: {
      const langs = wrap.topLanguages;
      return (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Top languages</p>
          <h2 className="mt-3 text-2xl font-bold text-white">What {displayName} builds with</h2>
          {langs.length === 0 ? (
            <p className="mt-6 text-sm text-white/70">No language data available yet.</p>
          ) : (
            <div className="mt-6 w-full space-y-2.5">
              {langs.map((lang) => (
                <div key={lang.name} className="text-left">
                  <div className="mb-1 flex items-center justify-between text-xs text-white/90">
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: lang.color ?? "#ffffff" }}
                      />
                      {lang.name}
                    </span>
                    <span className="font-mono">{lang.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div className="h-full rounded-full bg-white" style={{ width: `${lang.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      );
    }
    case 2:
      return (
        <>
          <Flame className="h-8 w-8 text-white" />
          <p className="mt-4 font-mono text-6xl font-bold text-white">{wrap.longestStreak}</p>
          <p className="mt-2 text-sm text-white/80">day longest streak</p>
          <p className="mt-8 text-sm text-white/90">
            Most active on <span className="font-semibold">{wrap.mostActiveWeekday}s</span>
          </p>
          <p className="mt-1 text-xs text-white/60">{wrap.weekendPercent}% of activity happens on weekends</p>
        </>
      );
    case 3:
      return wrap.topRepo ? (
        <>
          <Star className="h-8 w-8 text-white" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/70">Top repository</p>
          <h2 className="mt-2 break-all text-2xl font-bold text-white">{wrap.topRepo.name}</h2>
          <p className="mt-3 text-sm text-white/80">
            {wrap.topRepo.contributions} contributions &middot; {wrap.topRepo.stargazerCount}{" "}
            {wrap.topRepo.stargazerCount === 1 ? "star" : "stars"}
          </p>
        </>
      ) : (
        <>
          <Star className="h-8 w-8 text-white" />
          <p className="mt-4 text-sm text-white/80">No repository contributions found this year.</p>
        </>
      );
    case 4:
      return (
        <>
          <Sparkles className="h-8 w-8 text-white" />
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-white/70">
            {displayName}&apos;s coder personality
          </p>
          <h2 className="mt-3 text-3xl font-bold text-white">{wrap.personality.label}</h2>
          <p className="mt-3 text-sm leading-relaxed text-white/85">{wrap.personality.description}</p>
        </>
      );
    default:
      return <FinalCard wrap={wrap} />;
  }
}

function FinalCard({ wrap }: { wrap: WrapData }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = useMemo(
    () => (typeof window !== "undefined" ? window.location.href : ""),
    []
  );
  const imageUrl = `/u/${encodeURIComponent(wrap.login)}/opengraph-image`;

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${wrap.login}'s CodeWrapped`,
          text: `Check out my GitHub year, wrapped: ${wrap.personality.label}`,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled or share failed — fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do
    }
  }

  return (
    <>
      <Trophy className="h-8 w-8 text-white" />
      <h2 className="mt-4 text-2xl font-bold text-white">{wrap.personality.label}</h2>
      <p className="mt-1 text-sm text-white/80">@{wrap.login}&apos;s year, wrapped</p>

      <div className="mt-6 grid w-full grid-cols-3 gap-3 text-white">
        <div>
          <p className="font-mono text-xl font-bold">{wrap.totalContributions}</p>
          <p className="text-[10px] uppercase tracking-wide text-white/70">Contributions</p>
        </div>
        <div>
          <p className="font-mono text-xl font-bold">{wrap.longestStreak}</p>
          <p className="text-[10px] uppercase tracking-wide text-white/70">Day streak</p>
        </div>
        <div>
          <p className="font-mono text-xl font-bold">{wrap.topLanguages[0]?.name ?? "—"}</p>
          <p className="text-[10px] uppercase tracking-wide text-white/70">Top language</p>
        </div>
      </div>

      <div className="mt-8 flex w-full gap-2.5">
        <a
          href={imageUrl}
          download={`${wrap.login}-codewrapped.png`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/15 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </a>
        <button
          type="button"
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-xs font-semibold text-[#0d0221] transition-transform active:scale-[0.97]"
        >
          <Share2 className="h-3.5 w-3.5" />
          {copied ? "Link copied!" : "Share"}
        </button>
      </div>

      <Link href="/" className="mt-6 text-[11px] text-white/60 underline underline-offset-4 hover:text-white">
        Wrap another username
      </Link>
    </>
  );
}
