import axios from 'axios';
import config from 'src/config';

const { apiBase, zuora: zuoraConfig, apiRequestHeaders } = config;

export const sparkpost = axios.create({
  baseURL: apiBase,
  headers: apiRequestHeaders,
  withCredentials: true
});

export const zuora = axios.create({
  baseURL: zuoraConfig.baseUrl
});
