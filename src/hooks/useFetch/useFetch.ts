import { useCallback } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { axios } from '@/app';

import { IApiResponse } from './useFetch.types';

const useFetch = () => {
  const request = useCallback(async <T>(params: AxiosRequestConfig) => {
    let axiosResponse: AxiosResponse<IApiResponse<T>>;
    try {
      axiosResponse = await axios.request({
        ...params,
      });
      return {
        content: axiosResponse?.data as T,
        statusCode: axiosResponse?.status,
      };
    } catch (error: unknown) {
      const axiosResponse = (error as { response?: AxiosResponse<IApiResponse<T>> })?.response;
      return Promise.reject({
        message: axiosResponse?.data?.message || 'error',
        statusCode: axiosResponse?.status,
      });
    }
  }, []);

  return { request };
};

export default useFetch;
