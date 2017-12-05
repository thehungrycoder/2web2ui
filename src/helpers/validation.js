import _ from 'lodash';
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

export const maxLength = _.memoize(function maxLength(length) {
  return (value) => (value && value.length > length) ? `Must be ${length} characters or less` : undefined;
});

export const minLength = _.memoize(function minLength(length) {
  return (value) => (value && value.length < length) ? `Must be at least ${length} characters` : undefined;
});

export const minNumber = _.memoize(function minNumber(min) {
  return (value) => (value < min) ? `Must be at least ${min}` : undefined;
});

export const maxNumber = _.memoize(function maxNumber(max) {
  return (value) => (value > max) ? `Must be less than ${max}` : undefined;
});
