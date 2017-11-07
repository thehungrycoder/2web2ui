import { email, emailLocal, domain } from 'src/helpers/validation';

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

  const parts = value.split('@');
  const validLocal = !emailLocal(parts[0]);
  const validDomain = !substitution(parts[1]) || !domain(parts[1]);

  return !substitution(value) || !email(value) || (validLocal && validDomain) ? undefined : 'Invalid email or substitution value';
}

function contentRequired(html, text) {
  return !html && !text ? 'Template content is required. Please add HTML or Text content.' : undefined;
}

function verifiedDomain(value) {
  return undefined; // TODO
}

function validJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return 'Invalid JSON';
  }
  return undefined;
}

export {
  ID_ALLOWED_CHARS,
  idSyntax,
  substitution,
  emailOrSubstitution,
  contentRequired,
  validJson,
  verifiedDomain
};
