import axios, { AxiosInstance } from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 6000,
}) as AxiosInstance;

api.interceptors.response.use(
  (response) => response,
  async (RequestError) => {
    const errorResponse = RequestError.response;
    if (errorResponse && errorResponse.data) {
      return Promise.reject(new Error(errorResponse.data.message));
    } else {
      return Promise.reject(RequestError);
    }
  },
);

api.interceptors.request.use(
  async (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

export { api };
