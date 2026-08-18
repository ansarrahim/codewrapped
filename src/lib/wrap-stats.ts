import type { RawGithubUser } from "./github";

const WEEKDAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export type WrapData = {
  login: string;
  name: string | null;
  avatarUrl: string;
  totalContributions: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  reposContributedTo: number;
  longestStreak: number;
  activeDays: number;
  mostActiveWeekday: string;
  weekendPercent: number;
  topLanguages: { name: string; color: string | null; percent: number }[];
  topRepo: { name: string; url: string; stargazerCount: number; contributions: number } | null;
  personality: { label: string; description: string };
};

function longestStreak(days: { contributionCount: number }[]): number {
  let longest = 0;
  let current = 0;
  for (const day of days) {
    if (day.contributionCount > 0) {
      current += 1;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

function mostActiveWeekday(days: { weekday: number; contributionCount: number }[]): string {
  const totals = new Array(7).fill(0);
  for (const day of days) totals[day.weekday] += day.contributionCount;
  const maxIndex = totals.indexOf(Math.max(...totals));
  return WEEKDAY_NAMES[maxIndex];
}

function weekendPercent(days: { weekday: number; contributionCount: number }[], total: number): number {
  if (total === 0) return 0;
  const weekend = days
    .filter((d) => d.weekday === 0 || d.weekday === 6)
    .reduce((sum, d) => sum + d.contributionCount, 0);
  return Math.round((weekend / total) * 100);
}

function topLanguages(
  languageBytes: Record<string, { size: number; color: string | null }>
): { name: string; color: string | null; percent: number }[] {
  const entries = Object.entries(languageBytes);
  const total = entries.reduce((sum, [, v]) => sum + v.size, 0);
  if (total === 0) return [];
  return entries
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 5)
    .map(([name, v]) => ({ name, color: v.color, percent: Math.round((v.size / total) * 100) }));
}

function derivePersonality(input: {
  weekendPercent: number;
  topLanguages: { percent: number }[];
  longestStreak: number;
  activeDaysRatio: number;
  totalCommits: number;
  totalPRs: number;
}): { label: string; description: string } {
  if (input.weekendPercent >= 40) {
    return { label: "Weekend Warrior", description: "Codes just as hard on Saturday and Sunday as any weekday." };
  }
  if (input.topLanguages[0]?.percent >= 70) {
    return { label: "The Specialist", description: "Goes deep in one language rather than spreading thin." };
  }
  if (input.topLanguages.length >= 4 && (input.topLanguages[0]?.percent ?? 0) < 40) {
    return { label: "The Polyglot", description: "Comfortably moves across languages instead of sticking to one." };
  }
  if (input.longestStreak >= 30) {
    return { label: "Consistency Machine", description: `A ${input.longestStreak}-day streak without missing a beat.` };
  }
  if (input.activeDaysRatio >= 0.6) {
    return { label: "Everyday Committer", description: "Shows up and ships on most days of the year." };
  }
  if (input.totalPRs > input.totalCommits) {
    return { label: "The Collaborator", description: "More pull requests than solo commits — built for teamwork." };
  }
  return { label: "The Builder", description: "Steadily shipping real work, on their own schedule." };
}

export function computeWrapData(raw: RawGithubUser): WrapData {
  const activeDays = raw.days.filter((d) => d.contributionCount > 0).length;
  const activeDaysRatio = raw.days.length > 0 ? activeDays / raw.days.length : 0;
  const languages = topLanguages(raw.languageBytes);
  const streak = longestStreak(raw.days);
  const weekendPct = weekendPercent(raw.days, raw.totalContributions);

  return {
    login: raw.login,
    name: raw.name,
    avatarUrl: raw.avatarUrl,
    totalContributions: raw.totalContributions,
    totalCommits: raw.totalCommitContributions,
    totalPRs: raw.totalPullRequestContributions,
    totalIssues: raw.totalIssueContributions,
    reposContributedTo: raw.totalRepositoriesWithContributedCommits,
    longestStreak: streak,
    activeDays,
    mostActiveWeekday: mostActiveWeekday(raw.days),
    weekendPercent: weekendPct,
    topLanguages: languages,
    topRepo: raw.topRepos[0] ?? null,
    personality: derivePersonality({
      weekendPercent: weekendPct,
      topLanguages: languages,
      longestStreak: streak,
      activeDaysRatio,
      totalCommits: raw.totalCommitContributions,
      totalPRs: raw.totalPullRequestContributions,
    }),
  };
}
