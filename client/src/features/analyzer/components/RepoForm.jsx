import { useState, useEffect } from 'react';
import { useAnalyzeRepo } from '../hooks/useAnalyzeRepo';
import { useRepoPreview } from '../hooks/useRepoPreview';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import ApiErrorBanner from './ApiErrorBanner';
import RepoPreviewCard from './RepoPreviewCard';
import { isValidGithubUrl } from '../../../utils/validation';

export default function RepoForm({ onSuccess, onLoadingChange }) {
  const [url, setUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const { analyzeRepo, loading, error, errorCode, clearError } = useAnalyzeRepo();
  const { preview, previewLoading } = useRepoPreview(url);

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  function handleUrlChange(e) {
    setUrl(e.target.value);
    if (validationError) setValidationError('');
    if (error) clearError();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setValidationError('');

    if (!isValidGithubUrl(url)) {
      setValidationError('Please enter a valid GitHub repository URL.');
      return;
    }

    const data = await analyzeRepo(url);
    if (data) onSuccess?.(data);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl space-y-4">
      <Input
        label="GitHub Repository URL"
        type="url"
        placeholder="https://github.com/owner/repo"
        value={url}
        onChange={handleUrlChange}
        error={validationError}
        disabled={loading}
      />
      <RepoPreviewCard preview={preview} loading={previewLoading} />
      {error && <ApiErrorBanner message={error} code={errorCode} onDismiss={clearError} />}
      <Button type="submit" loading={loading} className="w-full">
        {loading ? 'Analyzing repository…' : 'Analyze Repository'}
      </Button>
    </form>
  );
}
