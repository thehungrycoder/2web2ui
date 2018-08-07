import _ from 'lodash';
import { formatBytes } from 'src/helpers/units';
import { emailRegex, emailLocalRegex, domainRegex, abTestIdRegex } from './regex';
import isURL from 'validator/lib/isURL';
import Payment from 'payment';

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

export function abTestId(value) {
  return abTestIdRegex.test(value) ? undefined : 'Must contain only letters, numbers, hyphens, and underscores';
}

export function abTestDefaultTemplate(value, allValues, props) {
  if (props.templates.includes(value)) {
    return undefined;
  }
  if (allValues.subaccount) {
    return 'Template not available to selected subaccount';
  }
  return 'Subaccount templates not available to master account';
}

export function hasNumber(value) {
  return /\d+/.test(value) ? undefined : 'Must have at least 1 number';
}

export function specialCharacter(value) {
  return /[\W_]+/.test(value) ? undefined : 'Must have at least 1 special character (list)';
}

export function hasLetter(value) {
  return /[A-Za-z]+/.test(value) ? undefined : 'Must have at least 1 letter';
}

export function endsWithWhitespace(value) {
  return /[\S]$/.test(value) ? undefined : 'Can\'t end in a whitespace character';
}

export function nonEmptyFile(file) {
  return !file || file.size > 0 ? undefined : 'File must be non-empty';
}

export const fileExtension = _.memoize(function fileExtension(extension) {
  const regex = RegExp(`.${extension}$`);
  return (file) => !file || regex.test(file.name) ? undefined : `Must be a .${extension} file`;
});

export const maxLength = _.memoize(function maxLength(length) {
  return (value) => (value && value.length > length) ? `Must be ${length} characters or less` : undefined;
});

export const minLength = _.memoize(function minLength(length) {
  return (value) => (typeof value !== 'undefined' && value.length < length) ? `Must be at least ${length} characters` : undefined;
});

export const integer = (value) => /^-?[0-9]+$/.test(value) ? undefined : 'Integers only please';

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

export function url(value) {
  return isURL(value) ? undefined : 'Must be a valid URL';
}

export const cardExpiry = (value) => (
  Payment.fns.validateCardExpiry(value) ? undefined : 'Please choose a valid expiration date'
);
