import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { NotificationProps } from '../component/Notification/Notification';
// Define a base URL for your API
const baseURL = 'http://localhost:3000';

// Create an instance of Axios with the base URL
const api = axios.create({
  baseURL,
  timeout: 10000,
  timeoutErrorMessage: 'Request timed out',
  withCredentials: true,
  xsrfCookieName: 'scas',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Define a function to make API calls
const request = async <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T, any>> => {
  try {
    const response: AxiosResponse<T> = await api.request<T>(config);
    return response;
  } catch (error: any) {
    return error;
  }
};

export default request;
