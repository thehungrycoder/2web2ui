import axios from 'axios';
import config from 'src/config';

const { apiBase, apiRequestTimeout, zuora: zuoraConfig, apiRequestHeaders } = config;

export const sparkpost = axios.create({
  baseURL: apiBase,
  timeout: apiRequestTimeout,
  headers: apiRequestHeaders
});

export const zuora = axios.create({
  baseURL: zuoraConfig.baseUrl,
  timeout: zuoraConfig.timeout
});
