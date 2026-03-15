import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://repovision-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const ERROR_CODES = {
  400: 'INVALID_URL',
  404: 'NOT_FOUND',
  429: 'RATE_LIMIT',
};

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
    } else if (status === 404) {
      message = serverMessage || 'Repository not found. Double-check the URL and try again.';
      code = 'NOT_FOUND';
    } else if (status === 429) {
      message = 'GitHub API rate limit reached. Please wait a moment or add a GITHUB_TOKEN on the server.';
      code = 'RATE_LIMIT';
    } else if (status === 400) {
      message = serverMessage || 'Invalid GitHub URL. Use the format: https://github.com/owner/repo';
      code = 'INVALID_URL';
    } else {
      message = serverMessage || 'Something went wrong. Please try again.';
      code = ERROR_CODES[status] ?? 'SERVER_ERROR';
    }

    const err = new Error(message);
    err.code = code;
    return Promise.reject(err);
  }
);

export default api;
