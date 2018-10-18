import { email, emailLocal, domain } from 'src/helpers/validation';

// This validator is intentionally not very good
// Legacy app uses this regex: /^{{\s*(\w|\.)+\s*}}$/ - however does not handle complex but valid substitution data
function looseSubstitution(value) {
  return value.includes('{{') && value.includes('}}') ? undefined : 'Substitution syntax error';
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

export {
  looseSubstitution,
  emailOrSubstitution
};
