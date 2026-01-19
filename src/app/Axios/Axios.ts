import axiosApi from 'axios';
import { getSessionToken } from '@tiendanube/nexo';

import nexo from '../NexoClient';
import { autoRegistrationStore } from '../AutoRegistrationStore/AutoRegistrationStore';

const apiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const axios = axiosApi.create({
  baseURL: `${apiUrl}/api`,
  withCredentials: true,
});

axios.interceptors.request.use(
  async (config) => {
    if (config.headers) {
      const token = await getSessionToken(nexo);
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// Interceptor para capturar 402 (usuário criado, precisa fazer login)
axios.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response?.status === 402) {
      const data = error.response.data;
      if (data?.status === 'user_created' && data?.credentials) {
        autoRegistrationStore.dispatch({
          email: data.credentials.email,
          password: data.credentials.password,
          name: data.credentials.name,
        });
      }
    }
    return Promise.reject(error);
  },
);

export default axios;
