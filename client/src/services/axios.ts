import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong. Please try again.';

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (data && data.message) {
        message = data.message;
      } else {
        switch (status) {
          case 400:
            message = 'Bad request. Please verify your inputs.';
            break;
          case 401:
            message = 'Session expired or unauthorized. Please log in.';
            break;
          case 403:
            message = 'Access forbidden. You do not have permission.';
            break;
          case 404:
            message = 'Requested resource not found.';
            break;
          case 409:
            message = 'Conflict. This email might already be registered.';
            break;
          case 500:
            message = 'Internal server error. Please try again later.';
            break;
        }
      }
    } else if (error.request) {
      message = 'Network error. Please check if the backend server is running.';
    } else {
      message = error.message;
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
