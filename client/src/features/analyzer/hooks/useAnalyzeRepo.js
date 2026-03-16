import { useState } from 'react';
import { repoService } from '../../../services/repoService';

export function useAnalyzeRepo() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);

  function clearError() {
    setError(null);
    setErrorCode(null);
  }

  async function analyzeRepo(repoUrl) {
    setLoading(true);
    clearError();
    try {
      const data = await repoService.analyzeRepo(repoUrl);
      return data;
    } catch (err) {
      setError(err.message);
      setErrorCode(err.code ?? 'SERVER_ERROR');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { analyzeRepo, loading, error, errorCode, clearError };
}
