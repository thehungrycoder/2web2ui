import axios from 'axios';
import config from 'src/config';

const { apiBase, apiRequestTimeout, zuora: zuoraConfig } = config;

export const sparkpost = axios.create({
  baseURL: apiBase,
  timeout: apiRequestTimeout,
  headers: {
    'x-sparky': config.authentication.headers.xsparky
  }
});

export const zuora = axios.create({
  baseURL: zuoraConfig.baseUrl,
  timeout: zuoraConfig.timeout
});
