import axios from 'axios';
import config from 'src/config';

const { apiBase, labsBase, zuora: zuoraConfig, brightback: brightbackConfig, apiRequestHeaders } = config;

export const sparkpost = axios.create({
  baseURL: apiBase,
  headers: apiRequestHeaders,
  withCredentials: true
});

export const sparkpostLabs = axios.create({
  baseURL: labsBase,
  headers: apiRequestHeaders,
  withCredentials: true
});

export const zuora = axios.create({
  baseURL: zuoraConfig.baseUrl
});

export const brightback = axios.create({
  baseURL: brightbackConfig.baseUrl
});
