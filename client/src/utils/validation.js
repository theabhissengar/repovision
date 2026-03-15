const GITHUB_URL_PATTERN = /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+(\/)?$/;

export function isValidGithubUrl(url) {
  return GITHUB_URL_PATTERN.test(url.trim());
}
