import { useParams } from 'react-router-dom';
import AnalysisDashboard from '../features/dashboard/components/AnalysisDashboard';

export default function DashboardPage() {
  const { jobId } = useParams();

  return (
    <div className="p-5 md:p-7 max-w-5xl mx-auto bg-(--rv-bg-0) text-(--rv-text-1)">
      <AnalysisDashboard jobId={jobId} />
    </div>
  );
}
