import moment from 'moment';
import * as jsCookie from 'js-cookie';
import config from 'src/config';

const { name, ageDays, options } = config.cookieConsent.cookie;

const isCookieSet = () => jsCookie.get(name) !== undefined;

const setCookie = () =>
  jsCookie.set(name, moment().format(), { ...options, expires: ageDays });

export default { isCookieSet, setCookie };
