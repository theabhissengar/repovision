import { useState, useEffect, useRef } from 'react';
import { repoService } from '../../../services/repoService';
import { isValidGithubUrl } from '../../../utils/validation';

const DEBOUNCE_MS = 500;

export function useRepoPreview(url) {
  const [preview, setPreview] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  // Incremented on every new request; lets us discard stale responses.
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (!isValidGithubUrl(url)) {
      setPreview(null);
      setPreviewLoading(false);
      return;
    }

    setPreviewLoading(true);
    const currentId = ++requestIdRef.current;

    const timer = setTimeout(async () => {
      try {
        const data = await repoService.previewRepo(url);
        if (requestIdRef.current === currentId) setPreview(data);
      } catch {
        if (requestIdRef.current === currentId) setPreview(null);
      } finally {
        if (requestIdRef.current === currentId) setPreviewLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [url]);

  return { preview, previewLoading };
}
