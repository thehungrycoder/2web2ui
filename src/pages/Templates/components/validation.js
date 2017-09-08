import { email, emailLocal, domain } from 'helpers/validation';

const ID_ALLOWED_CHARS = 'a-z0-9_-';

function substitution(value) {
  return /{{\s*(\w|\.)+\s*}}/.test(value) ? undefined : 'Substitution sytax error';
}

function idSyntax(value) {
  return new RegExp(`/^[${ID_ALLOWED_CHARS}]*$/`).test(value) ? undefined : 'Can only contain lowercase letters, numbers, hyphens and underscores';
}

function emailOrSubstitution(value) {
  if (!value) {
    return undefined;
  }
  const validEmail = !email(value);
  const parts = value.split('@');
  const validLocal = !emailLocal(parts[0]);
  const validDomain = !substitution(parts[1]) || !domain(parts[1]);

  return validEmail || (validLocal && validDomain) ? undefined : 'Invalid email';
}

function verifiedDomain(value) {
  return undefined; // TODO
}

export {
  ID_ALLOWED_CHARS,
  idSyntax,
  substitution,
  emailOrSubstitution,
  verifiedDomain
};
