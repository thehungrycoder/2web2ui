import _ from 'lodash';
import { formatBytes } from 'src/helpers/formatting';
import { emailRegex, emailLocalRegex, domainRegex } from './regex';

export function required(value) {
  return value ? undefined : 'Required';
}

export function email(value) {
  return emailRegex.test(value) ? undefined : 'Invalid Email';
}

export function emailLocal(value) {
  return emailLocalRegex.test(value) ? undefined : 'Invalid Email';
}

export function domain(value) {
  return domainRegex.test(value) ? undefined : 'Invalid Domain';
}

export const maxLength = _.memoize(function maxLength(length) {
  return (value) => (value && value.length > length) ? `Must be ${length} characters or less` : undefined;
});

export const minLength = _.memoize(function minLength(length) {
  return (value) => (typeof value !== 'undefined' && value.length < length) ? `Must be at least ${length} characters` : undefined;
});

export const minNumber = _.memoize(function minNumber(min) {
  return (value) => (value < min) ? `Must be at least ${min}` : undefined;
});

export const maxNumber = _.memoize(function maxNumber(max) {
  return (value) => (value > max) ? `Must be less than ${max}` : undefined;
});

export const maxFileSize = _.memoize(function maxFilesSize(maxSize) {
  return (file) => {
    if (!file) {
      return undefined;
    }
    return (file.size < maxSize) ? undefined : `Please keep file size under ${formatBytes(maxSize)}`;
  };
});

