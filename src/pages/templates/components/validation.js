import { email, emailLocal, domain } from 'src/helpers/validation';
import _ from 'lodash';

const ID_ALLOWED_CHARS = 'a-z0-9_-';

// This validator is intentionally not very good
// Legacy app uses this regex: /^{{\s*(\w|\.)+\s*}}$/ - however does not handle complex but valid substitution data
function looseSubstitution(value) {
  return value.includes('{{') && value.includes('}}') ? undefined : 'Substitution syntax error';
}

function idSyntax(value) {
  return new RegExp(`^[${ID_ALLOWED_CHARS}]*$`).test(value) ? undefined : 'Can only contain lowercase letters, numbers, hyphens and underscores';
}

function emailOrSubstitution(value) {
  if (!value) {
    return undefined;
  }

  const parts = value.split('@');

  if (parts.length > 1) {
    const validLocal = !looseSubstitution(parts[0]) || !emailLocal(parts[0]);
    const validDomain = !looseSubstitution(parts[1]) || !domain(parts[1]);
    return validLocal && validDomain ? undefined : 'Invalid email or substitution value';
  }

  return !looseSubstitution(value) || !email(value) ? undefined : 'Invalid email or substitution value';
}

function contentRequired(value, allValues) {
  const html = _.get(allValues, 'content.html');
  const text = _.get(allValues, 'content.text');
  return !html && !text ? 'Template HTML or text content is required.' : undefined;
}

function validJson(value, { testData }) {
  try {
    JSON.parse(testData);
  } catch (e) {
    return 'Invalid Test Data';
  }

  return undefined;
}

export {
  ID_ALLOWED_CHARS,
  idSyntax,
  looseSubstitution,
  emailOrSubstitution,
  contentRequired,
  validJson
};
