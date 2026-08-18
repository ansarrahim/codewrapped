import { FolderGit2 } from "lucide-react";
import UsernameForm from "@/components/UsernameForm";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden font-sans">
      <div
        aria-hidden="true"
        className="animate-blob-float pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #a855f7, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="animate-blob-float pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #fb923c, transparent 70%)", animationDelay: "-6s" }}
      />

      <header className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-bold text-[#0d0221]"
            style={{ background: "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #fb923c 100%)" }}
          >
            {"{}"}
          </span>
          <span className="text-base font-semibold tracking-tight text-white">CodeWrapped</span>
        </div>
      </header>

      <main id="main-content" className="relative z-10 flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-pink-300">
            Your GitHub, wrapped
          </span>
          <h1 className="gradient-text mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Your coding year, wrapped up.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#a89fc4] sm:text-base">
            Enter any public GitHub username — yours, a friend&apos;s, a hero&apos;s — and get a
            shareable summary of their year: top languages, longest streak, most active repo, and
            a personality label pulled from real contribution data.
          </p>

          <div className="mt-8 flex justify-center">
            <UsernameForm />
          </div>

          <a
            href="https://github.com/ansarrahim/codewrapped"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-1.5 text-xs text-[#a89fc4] transition-colors hover:text-white"
          >
            <FolderGit2 className="h-3.5 w-3.5" />
            Source on GitHub
          </a>
        </div>
      </main>

      <footer className="relative z-10 px-4 py-8 text-center sm:px-6 lg:px-8">
        <a
          href="https://crewlogic-labs.vercel.app"
          className="text-xs text-[#a89fc4] transition-colors hover:text-pink-300"
        >
          Built by Muhammad Ansar — more projects at CrewLogic Labs →
        </a>
      </footer>
    </div>
  );
}
