import { email, emailLocal, domain } from 'src/helpers/validation';
import _ from 'lodash';

const ID_ALLOWED_CHARS = 'a-z0-9_-';

function substitution(value) {
  return /{{\s*(\w|\.)+\s*}}/.test(value) ? undefined : 'Substitution syntax error';
}

function idSyntax(value) {
  return new RegExp(`^[${ID_ALLOWED_CHARS}]*$`).test(value) ? undefined : 'Can only contain lowercase letters, numbers, hyphens and underscores';
}

function emailOrSubstitution(value) {
  if (!value) {
    return undefined;
  }

  console.log('validate', value);

  const parts = value.split('@');
  const validLocal = !emailLocal(parts[0]);
  const validDomain = !substitution(parts[1]) || !domain(parts[1]);

  console.log(!substitution(value) || !email(value) || (validLocal && validDomain) ? undefined : 'Invalid email or substitution value');

  return !substitution(value) || !email(value) || (validLocal && validDomain) ? undefined : 'Invalid email or substitution value';
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
  substitution,
  emailOrSubstitution,
  contentRequired,
  validJson
};
