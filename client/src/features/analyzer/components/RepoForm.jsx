import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnalyzeRepo } from '../hooks/useAnalyzeRepo';
import { useRepoPreview } from '../hooks/useRepoPreview';
import Button from '../../../components/ui/Button';
import ApiErrorBanner from './ApiErrorBanner';
import RepoPreviewCard from './RepoPreviewCard';
import { isValidGithubUrl } from '../../../utils/validation';

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default function RepoForm({ onSuccess, onLoadingChange, defaultUrl = '', onUrlChange }) {
  const [url, setUrl] = useState(defaultUrl);
  const [validationError, setValidationError] = useState('');
  const [focused, setFocused] = useState(false);
  const { analyzeRepo, loading, error, errorCode, clearError } = useAnalyzeRepo();
  const { preview, previewLoading } = useRepoPreview(url);

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  useEffect(() => {
    if (defaultUrl !== url) {
      // We intentionally sync the local input state when the parent-provided
      // defaultUrl changes (e.g. when selecting an example repo).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrl(defaultUrl);
      onUrlChange?.(defaultUrl);
      // Clear stale validation / API errors when user selects an example
      if (validationError) setValidationError('');
      if (error) clearError();
    }
  }, [defaultUrl, url, onUrlChange, validationError, error, clearError]);

  function handleUrlChange(e) {
    const value = e.target.value;
    setUrl(value);
    onUrlChange?.(value);
    if (validationError) setValidationError('');
    if (error) clearError();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setValidationError('');
    if (!isValidGithubUrl(url)) {
      setValidationError('Enter a valid GitHub repo, e.g. vercel/next.js or full GitHub URL.');
      return;
    }
    const data = await analyzeRepo(url);
    if (data) onSuccess?.(data);
  }

  const hasError = validationError || error;

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Terminal-style search input */}
      <div
        className="flex rounded-xl border overflow-hidden transition-all duration-200"
        style={{
          background: 'var(--rv-bg-2)',
          borderColor: hasError
            ? 'rgba(248,113,113,0.5)'
            : focused
              ? 'var(--rv-blue)'
              : 'var(--rv-border-1)',
          boxShadow: focused && !hasError
            ? '0 0 0 3px rgba(74,158,255,0.1)'
            : hasError
              ? '0 0 0 3px rgba(248,113,113,0.1)'
              : 'none',
        }}
      >
        {/* Prefix */}
        <div
          className="flex items-center px-3.5 border-r shrink-0"
          style={{
            borderColor: 'var(--rv-border-1)',
            background: 'var(--rv-bg-3)',
          }}
        >
          <span
            className="text-xs select-none"
            style={{ color: 'var(--rv-text-3)', fontFamily: 'var(--rv-font-mono)' }}
          >
            github.com/
          </span>
        </div>

        {/* Input */}
        <input
          type="text"
          value={url.replace(/^https?:\/\/github\.com\//i, '')}
          onChange={(e) => {
            const raw = e.target.value;
            const full = raw
              ? raw.startsWith('https://') || raw.startsWith('http://')
                ? raw
                : `https://github.com/${raw}`
              : '';
            handleUrlChange({ target: { value: full } });
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="owner/repo"
          disabled={loading}
          className="flex-1 bg-transparent px-3 py-3 text-sm outline-none min-w-0"
          style={{
            color: 'var(--rv-text-1)',
            fontFamily: 'var(--rv-font-mono)',
          }}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
        />

        {/* Submit button inside input */}
        <button
          type="submit"
          disabled={loading}
          className="px-4 flex items-center gap-2 text-sm font-medium transition-all duration-150 shrink-0 cursor-pointer"
          style={{
            background: loading ? 'var(--rv-bg-3)' : 'var(--rv-blue)',
            color: loading ? 'var(--rv-text-3)' : 'white',
            borderLeft: '1px solid var(--rv-border-1)',
          }}
        >
          {loading ? (
            <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          ) : (
            <SearchIcon />
          )}
          <span className="hidden sm:inline">
            {loading ? 'Analyzing…' : 'Analyze'}
          </span>
        </button>
      </div>

      {/* Validation error */}
      <AnimatePresence>
        {validationError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs"
            style={{ color: 'var(--rv-rose)', fontFamily: 'var(--rv-font-mono)' }}
          >
            ✗ {validationError}
          </motion.p>
        )}
      </AnimatePresence>

      {/* API error */}
      {error && <ApiErrorBanner message={error} code={errorCode} onDismiss={clearError} />}

      {/* Preview card */}
      <RepoPreviewCard preview={preview} loading={previewLoading} />
    </form>
  );
}
