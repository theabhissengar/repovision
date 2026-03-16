import { useParams } from 'react-router-dom';
import AnalysisDashboard from '../features/dashboard/components/AnalysisDashboard';

export default function DashboardPage() {
  const { jobId } = useParams();

  return (
    <div className="p-5 md:p-7 max-w-5xl mx-auto">
      <AnalysisDashboard jobId={jobId} />
    </div>
  );
}
