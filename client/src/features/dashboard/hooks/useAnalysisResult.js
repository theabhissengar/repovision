import { useState, useEffect } from 'react';
import { repoService } from '../../../services/repoService';

export function useAnalysisResult(jobId) {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!jobId) return;

    let intervalId;

    async function pollStatus() {
      try {
        const { status: jobStatus } = await repoService.getJobStatus(jobId);
        setStatus(jobStatus);

        if (jobStatus === 'done') {
          clearInterval(intervalId);
          const result = await repoService.getAnalysis(jobId);
          setData(result);
        }

        if (jobStatus === 'failed') {
          clearInterval(intervalId);
          setError('Analysis failed. Please try again.');
        }
      } catch (err) {
        clearInterval(intervalId);
        setError(err.message);
      }
    }

    pollStatus();
    intervalId = setInterval(pollStatus, 3000);

    return () => clearInterval(intervalId);
  }, [jobId]);

  return { data, status, error };
}
