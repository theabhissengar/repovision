import { useState, useEffect } from 'react';
import { repoService } from '../../../services/repoService';

const initial = {
  data: null,
  scores: null,
  report: null,
  confidence: null,
  overallStatus: null,
  loading: false,
  error: null,
};

/**
 * Fetches GET /api/repo/health for owner/repo.
 * @param {string} owner
 * @param {string} repo
 */
export function useRepoHealth(owner, repo) {
  const [state, setState] = useState(initial);

  useEffect(() => {
    if (!owner?.trim() || !repo?.trim()) {
      setState(initial);
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    repoService
      .fetchRepoHealth(owner.trim(), repo.trim())
      .then((body) => {
        if (cancelled) return;
        setState({
          data: body.data ?? null,
          scores: body.scores ?? null,
          report: body.report ?? null,
          confidence: body.confidence ?? null,
          overallStatus: body.overallStatus ?? null,
          loading: false,
          error: null,
        });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({
          ...initial,
          loading: false,
          error: err.message || 'Unable to generate AI insights',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [owner, repo]);

  return state;
}
