const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const QUERY = `
query($login: String!) {
  user(login: $login) {
    login
    name
    avatarUrl
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalRepositoriesWithContributedCommits
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            weekday
          }
        }
      }
      commitContributionsByRepository(maxRepositories: 5) {
        repository {
          name
          url
          stargazerCount
        }
        contributions {
          totalCount
        }
      }
    }
    repositories(first: 100, ownerAffiliations: OWNER, orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes {
        languages(first: 5, orderBy: { field: SIZE, direction: DESC }) {
          edges {
            size
            node {
              name
              color
            }
          }
        }
      }
    }
  }
}
`;

export type ContributionDay = { date: string; contributionCount: number; weekday: number };

export type RawGithubUser = {
  login: string;
  name: string | null;
  avatarUrl: string;
  totalCommitContributions: number;
  totalPullRequestContributions: number;
  totalIssueContributions: number;
  totalRepositoriesWithContributedCommits: number;
  totalContributions: number;
  days: ContributionDay[];
  topRepos: { name: string; url: string; stargazerCount: number; contributions: number }[];
  languageBytes: Record<string, { size: number; color: string | null }>;
};

type GraphQLResponse = {
  data?: {
    user: {
      login: string;
      name: string | null;
      avatarUrl: string;
      contributionsCollection: {
        totalCommitContributions: number;
        totalPullRequestContributions: number;
        totalIssueContributions: number;
        totalRepositoriesWithContributedCommits: number;
        contributionCalendar: {
          totalContributions: number;
          weeks: { contributionDays: ContributionDay[] }[];
        };
        commitContributionsByRepository: {
          repository: { name: string; url: string; stargazerCount: number };
          contributions: { totalCount: number };
        }[];
      };
      repositories: {
        nodes: {
          languages: { edges: { size: number; node: { name: string; color: string | null } }[] } | null;
        }[];
      };
    } | null;
  };
  errors?: { type?: string; message: string }[];
};

export async function fetchGithubUser(username: string): Promise<RawGithubUser | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not configured.");

  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: QUERY, variables: { login: username } }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`GitHub API returned ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse;

  const notFound = json.errors?.some((e) => e.type === "NOT_FOUND");
  if (notFound || !json.data?.user) return null;

  const user = json.data.user;
  const cc = user.contributionsCollection;

  const days = cc.contributionCalendar.weeks.flatMap((w) => w.contributionDays);

  const topRepos = cc.commitContributionsByRepository
    .map((entry) => ({
      name: entry.repository.name,
      url: entry.repository.url,
      stargazerCount: entry.repository.stargazerCount,
      contributions: entry.contributions.totalCount,
    }))
    .sort((a, b) => b.contributions - a.contributions);

  const languageBytes: Record<string, { size: number; color: string | null }> = {};
  for (const repo of user.repositories.nodes) {
    for (const edge of repo.languages?.edges ?? []) {
      const existing = languageBytes[edge.node.name];
      languageBytes[edge.node.name] = {
        size: (existing?.size ?? 0) + edge.size,
        color: edge.node.color,
      };
    }
  }

  return {
    login: user.login,
    name: user.name,
    avatarUrl: user.avatarUrl,
    totalCommitContributions: cc.totalCommitContributions,
    totalPullRequestContributions: cc.totalPullRequestContributions,
    totalIssueContributions: cc.totalIssueContributions,
    totalRepositoriesWithContributedCommits: cc.totalRepositoriesWithContributedCommits,
    totalContributions: cc.contributionCalendar.totalContributions,
    days,
    topRepos,
    languageBytes,
  };
}
