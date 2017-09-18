import _ from 'lodash';

const regex = {
  email: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i,
  emailLocal: /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+$/i,
  username: /^[a-z0-9_\-\.]+$/,
  ip: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
  port: /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/,
  domain: /^(?!:\/\/)([a-z0-9-]+\.)*[a-z0-9][a-z0-9-]+\.[a-z]{2,63}$/i
};

export function required(value) {
  return value ? undefined : 'Required';
}

export function email(value) {
  return regex.email.test(value) ? undefined : 'Invalid Email';
}

export function emailLocal(value) {
  return regex.emailLocal.test(value) ? undefined : 'Invalid Email';
}

export function domain(value) {
  return regex.domain.test(value) ? undefined : 'Invalid Domain';
}

export const maxLength = _.memoize(function maxLength(length) {
  return (value) => (value && value.length > length) ? `Must be ${length} characters or less` : undefined;
});
