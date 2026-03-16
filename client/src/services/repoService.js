import api from './api';

export const repoService = {
  previewRepo(repoUrl) {
    return api.post('/preview', { repoUrl });
  },

  analyzeRepo(repoUrl) {
    return api.post('/analyze', { repoUrl });
  },

  getAnalysis(jobId) {
    return api.get(`/analysis/${jobId}`);
  },

  getJobStatus(jobId) {
    return api.get(`/analysis/${jobId}/status`);
  },

  compareRepos(repo1, repo2) {
    return api.post('/compare', { repo1, repo2 });
  },
};
