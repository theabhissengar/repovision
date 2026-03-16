import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import { useTheme } from '../context/ThemeContext';

const DARK_BASE      = '#1c1c2e';
const DARK_HIGHLIGHT = '#252538';
const LIGHT_BASE     = '#e8e8f4';
const LIGHT_HIGHLIGHT = '#f0f0f9';

const LEGEND_WIDTHS = ['48%', '62%', '38%', '54%', '42%'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const sectionVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

function StatCardSkeleton() {
  return (
    <Card className="flex items-center gap-4">
      <Skeleton circle width={44} height={44} />
      <div className="flex-1 min-w-0">
        <Skeleton width="55%" height={13} style={{ marginBottom: 8 }} />
        <Skeleton width="40%" height={28} />
      </div>
    </Card>
  );
}

function ActivityCardSkeleton() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-5">
        <div>
          <Skeleton width={160} height={20} style={{ marginBottom: 6 }} />
          <Skeleton width={210} height={13} />
        </div>
        <Skeleton width={72} height={26} borderRadius={9999} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Skeleton width="70%" height={11} style={{ marginBottom: 8 }} />
          <Skeleton width={56} height={36} />
        </div>
        <div>
          <Skeleton width="50%" height={11} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={24} style={{ marginBottom: 6 }} />
          <Skeleton width="55%" height={13} />
        </div>
      </div>
    </Card>
  );
}

function LanguageChartSkeleton() {
  return (
    <Card>
      <Skeleton width={200} height={20} style={{ marginBottom: 6 }} />
      <Skeleton width={170} height={13} style={{ marginBottom: 24 }} />

      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <div className="w-48 h-48 shrink-0">
          <Skeleton circle width={192} height={192} />
        </div>

        <div className="flex-1 w-full space-y-3">
          {LEGEND_WIDTHS.map((w, i) => (
            <div key={i} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2" style={{ width: w }}>
                <Skeleton circle width={10} height={10} style={{ flexShrink: 0 }} />
                <Skeleton width="100%" height={14} />
              </div>
              <Skeleton width={36} height={14} />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default function AnalysisSkeleton() {
  const { theme } = useTheme();
  const baseColor      = theme === 'dark' ? DARK_BASE : LIGHT_BASE;
  const highlightColor = theme === 'dark' ? DARK_HIGHLIGHT : LIGHT_HIGHLIGHT;

  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <motion.div
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={sectionVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>
        </motion.div>

        <motion.div variants={sectionVariants}>
          <ActivityCardSkeleton />
        </motion.div>

        <motion.div variants={sectionVariants}>
          <LanguageChartSkeleton />
        </motion.div>
      </motion.div>
    </SkeletonTheme>
  );
}
