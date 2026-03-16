import { useState } from 'react';
import Input from './ui/Input';
import Button from './ui/Button';
import ApiErrorBanner from '../features/analyzer/components/ApiErrorBanner';
import { isValidGithubUrl } from '../utils/validation';
import { repoService } from '../services/repoService';

export default function RepoCompareForm({ onSuccess, onLoadingChange }) {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ url1: '', url2: '' });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  function clearApiError() {
    setApiError(null);
  }

  function handleUrl1Change(e) {
    setUrl1(e.target.value);
    if (fieldErrors.url1) setFieldErrors((p) => ({ ...p, url1: '' }));
    if (apiError) clearApiError();
  }

  function handleUrl2Change(e) {
    setUrl2(e.target.value);
    if (fieldErrors.url2) setFieldErrors((p) => ({ ...p, url2: '' }));
    if (apiError) clearApiError();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {
      url1: isValidGithubUrl(url1) ? '' : 'Please enter a valid GitHub repository URL.',
      url2: isValidGithubUrl(url2) ? '' : 'Please enter a valid GitHub repository URL.',
    };
    setFieldErrors(newErrors);
    if (newErrors.url1 || newErrors.url2) return;

    setLoading(true);
    onLoadingChange?.(true);
    setApiError(null);

    try {
      const result = await repoService.compareRepos(url1, url2);
      onSuccess?.(result);
    } catch (err) {
      setApiError({ message: err.message, code: err.code });
    } finally {
      setLoading(false);
      onLoadingChange?.(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-4">
      <Input
        label="Repository 1 URL"
        type="url"
        placeholder="https://github.com/owner/repo"
        value={url1}
        onChange={handleUrl1Change}
        error={fieldErrors.url1}
        disabled={loading}
      />
      <Input
        label="Repository 2 URL"
        type="url"
        placeholder="https://github.com/owner/repo"
        value={url2}
        onChange={handleUrl2Change}
        error={fieldErrors.url2}
        disabled={loading}
      />
      {apiError && (
        <ApiErrorBanner
          message={apiError.message}
          code={apiError.code}
          onDismiss={clearApiError}
        />
      )}
      <Button type="submit" loading={loading} className="w-full">
        {loading ? 'Comparing repositories…' : 'Compare Repositories'}
      </Button>
    </form>
  );
}
