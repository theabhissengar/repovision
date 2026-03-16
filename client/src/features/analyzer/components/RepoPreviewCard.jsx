import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { formatNumber } from '../../../utils/formatters';

function SkeletonLine({ className }) {
  return <div className={`bg-muted rounded animate-pulse ${className}`} />;
}

function Stat({ icon, value, label }) {
  return (
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      <span>{icon}</span>
      <span className="font-medium text-foreground">{formatNumber(value)}</span>
      {label && <span>{label}</span>}
    </span>
  );
}

function PreviewSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonLine className="h-5 w-52" />
      <SkeletonLine className="h-3.5 w-full" />
      <SkeletonLine className="h-3.5 w-4/5" />
      <div className="flex gap-4 pt-1">
        <SkeletonLine className="h-3.5 w-14" />
        <SkeletonLine className="h-3.5 w-14" />
        <SkeletonLine className="h-3.5 w-14" />
        <SkeletonLine className="h-3.5 w-20" />
      </div>
    </div>
  );
}

function PreviewData({ preview }) {
  const visibleTopics = preview.topics?.slice(0, 5) ?? [];
  const extraTopics = (preview.topics?.length ?? 0) - visibleTopics.length;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-base font-bold text-foreground leading-tight">{preview.name}</h3>
        {preview.description && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
            {preview.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        <Stat icon="⭐" value={preview.stars} label="stars" />
        <Stat icon="🍴" value={preview.forks} label="forks" />
        <Stat icon="🐛" value={preview.openIssues} label="issues" />
        {preview.language && (
          <span className="flex items-center gap-1 text-sm">
            <span>💻</span>
            <span className="font-medium text-foreground">{preview.language}</span>
          </span>
        )}
      </div>

      {visibleTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleTopics.map((t) => (
            <Badge key={t} color="violet">{t}</Badge>
          ))}
          {extraTopics > 0 && <Badge color="gray">+{extraTopics} more</Badge>}
        </div>
      )}
    </div>
  );
}

export default function RepoPreviewCard({ preview, loading }) {
  if (!loading && !preview) return null;

  return (
    <Card className="border-border-strong">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          Live Preview
        </span>
        {preview && !loading && (
          <a
            href={preview.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Open on GitHub ↗
          </a>
        )}
      </div>

      {loading ? <PreviewSkeleton /> : <PreviewData preview={preview} />}
    </Card>
  );
}
