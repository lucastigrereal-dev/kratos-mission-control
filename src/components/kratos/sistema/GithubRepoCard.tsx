import { FolderGit2, Star, GitFork, GitPullRequest, ExternalLink } from "lucide-react";
import { StatusCard } from "@/components/kratos/base/StatusCard";
import { StatusDot } from "@/components/kratos/base/StatusDot";
import type { GithubRepoStatus, GithubPR } from "../../../../api-contract/github.schema";

const PR_SEVERITY: Record<GithubPR["status"], "ok" | "info" | "ghost" | "muted"> = {
  open: "info",
  merged: "ok",
  draft: "ghost",
  closed: "muted",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `ha ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `ha ${hours}h`;
  const days = Math.floor(hours / 24);
  return `ha ${days}d`;
}

interface Props {
  repo: GithubRepoStatus;
}

export function GithubRepoCard({ repo }: Props) {
  const topPRs = repo.prs.slice(0, 3);
  const topCommits = repo.commitsRecentes.slice(0, 3);

  return (
    <StatusCard accent="none">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <FolderGit2
          className="h-3.5 w-3.5 shrink-0"
          style={{ color: "var(--kratos-text-muted)" }}
        />
        <a
          href={repo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[13px] font-medium hover:underline flex items-center gap-1.5"
          style={{ color: "var(--kratos-text-primary)" }}
        >
          {repo.nomeCompleto}
          <ExternalLink className="h-3 w-3" style={{ color: "var(--kratos-text-muted)" }} />
        </a>
      </div>

      {/* Description */}
      {repo.descricao && (
        <p
          className="text-[11px] mt-1 line-clamp-2"
          style={{ color: "var(--kratos-text-secondary)" }}
        >
          {repo.descricao}
        </p>
      )}

      {/* Stats + language */}
      <div className="flex items-center gap-4 mt-2 flex-wrap">
        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
          <Star className="h-3 w-3" /> {repo.stars}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
          <GitFork className="h-3 w-3" /> {repo.forks}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: "var(--kratos-text-muted)" }}>
          <GitPullRequest className="h-3 w-3" /> {repo.openIssues}
        </span>
        {repo.linguagem && (
          <span className="kratos-chip text-[10px]">{repo.linguagem}</span>
        )}
      </div>

      {/* PRs */}
      {topPRs.length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--kratos-border)" }}>
          <div
            className="text-[10px] kratos-mono uppercase tracking-[0.12em] mb-1.5"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            PRs abertos
          </div>
          {topPRs.map((pr) => (
            <div key={pr.id} className="flex items-center gap-2 py-0.5">
              <span
                className="text-[10px] kratos-mono shrink-0 w-8"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                #{pr.numero}
              </span>
              <span
                className="text-[11px] truncate flex-1"
                style={{ color: "var(--kratos-text-secondary)" }}
              >
                {pr.titulo}
              </span>
              <StatusDot severity={PR_SEVERITY[pr.status]} size="xs" />
            </div>
          ))}
        </div>
      )}

      {/* Commits */}
      {topCommits.length > 0 && (
        <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--kratos-border)" }}>
          <div
            className="text-[10px] kratos-mono uppercase tracking-[0.12em] mb-1.5"
            style={{ color: "var(--kratos-text-muted)" }}
          >
            Commits recentes
          </div>
          {topCommits.map((c) => (
            <div key={c.sha} className="flex items-center gap-2 py-0.5">
              <span
                className="text-[10px] kratos-mono shrink-0 w-[52px]"
                style={{ color: "var(--kratos-ghost)" }}
              >
                {c.sha}
              </span>
              <span
                className="text-[11px] truncate flex-1"
                style={{ color: "var(--kratos-text-secondary)" }}
              >
                {c.mensagem}
              </span>
              <span
                className="text-[10px] shrink-0"
                style={{ color: "var(--kratos-text-muted)" }}
              >
                {timeAgo(c.data)}
              </span>
            </div>
          ))}
        </div>
      )}
    </StatusCard>
  );
}
