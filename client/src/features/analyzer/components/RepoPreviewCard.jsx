import { motion } from 'framer-motion';
import GlowBadge from '../../../components/ui/GlowBadge';
import { formatNumber } from '../../../utils/formatters';

function SkeletonLine({ w = 'w-full', h = 'h-3.5' }) {
  return (
    <div
      className={`${w} ${h} rounded-md animate-shimmer`}
      style={{ background: 'var(--rv-bg-3)' }}
    />
  );
}

function StatPill({ icon, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs"
      style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-mono)' }}>
      <span style={{ color: 'var(--rv-text-3)' }}>{icon}</span>
      <span style={{ color: 'var(--rv-text-1)', fontWeight: 600 }}>{formatNumber(value)}</span>
    </span>
  );
}

function PreviewSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonLine w="w-52" h="h-4" />
      <SkeletonLine w="w-full" />
      <SkeletonLine w="w-4/5" />
      <div className="flex gap-4 pt-1">
        <SkeletonLine w="w-16" />
        <SkeletonLine w="w-16" />
        <SkeletonLine w="w-20" />
      </div>
    </div>
  );
}

function PreviewData({ preview }) {
  const visibleTopics = preview.topics?.slice(0, 4) ?? [];
  const extra = (preview.topics?.length ?? 0) - visibleTopics.length;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold leading-tight"
          style={{ color: 'var(--rv-text-1)', fontFamily: 'var(--rv-font-mono)' }}>
          {preview.name}
        </h3>
        {preview.description && (
          <p className="text-xs mt-1.5 line-clamp-2 leading-relaxed"
            style={{ color: 'var(--rv-text-2)', fontFamily: 'var(--rv-font-body)' }}>
            {preview.description}
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5">
        <StatPill icon="★" value={preview.stars} />
        <StatPill icon="⑂" value={preview.forks} />
        <StatPill icon="●" value={preview.openIssues} />
        {preview.language && (
          <span className="text-xs font-medium" style={{ color: 'var(--rv-cyan)', fontFamily: 'var(--rv-font-mono)' }}>
            {preview.language}
          </span>
        )}
      </div>

      {visibleTopics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleTopics.map((t) => (
            <GlowBadge key={t} color="blue" size="sm">{t}</GlowBadge>
          ))}
          {extra > 0 && <GlowBadge color="gray" size="sm">+{extra}</GlowBadge>}
        </div>
      )}
    </div>
  );
}

export default function RepoPreviewCard({ preview, loading }) {
  if (!loading && !preview) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border p-4"
      style={{
        background: 'var(--rv-bg-2)',
        borderColor: 'var(--rv-border-1)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-semibold uppercase tracking-widest"
          style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}>
          Preview
        </span>
        {preview && !loading && (
          <a
            href={preview.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: 'var(--rv-blue)' }}
          >
            Open on GitHub ↗
          </a>
        )}
      </div>
      {loading ? <PreviewSkeleton /> : <PreviewData preview={preview} />}
    </motion.div>
  );
}
