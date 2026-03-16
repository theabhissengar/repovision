import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://repovision-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.error;

    let message;
    let code;

    if (!error.response) {
      message = 'Cannot connect to the server. Make sure the backend is running.';
      code = 'NETWORK_ERROR';
    } else if (status === 400) {
      message = serverMessage || 'Invalid GitHub URL. Use the format: https://github.com/owner/repo';
      code = 'INVALID_URL';
    } else if (status === 404) {
      message = serverMessage || 'Repository not found. Double-check the URL and try again.';
      code = 'NOT_FOUND';
    } else if (status === 429) {
      message = serverMessage || 'GitHub API rate limit reached. Please wait a moment or add a GITHUB_TOKEN on the server.';
      code = 'RATE_LIMIT';
    } else if (status === 503) {
      message = serverMessage || 'Could not reach the GitHub API. Check your internet connection and try again.';
      code = 'NETWORK_ERROR';
    } else {
      message = serverMessage || 'Something went wrong. Please try again.';
      code = 'SERVER_ERROR';
    }

    const err = new Error(message);
    err.code = code;
    return Promise.reject(err);
  }
);

export default api;
