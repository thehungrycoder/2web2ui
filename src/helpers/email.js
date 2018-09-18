// Must use email-addresses to support 8-bit character sets, RFC6532
// see, https://tools.ietf.org/html/rfc6532
import emailAddresses from 'email-addresses';

// standardize the record structure
const parts = ({ address, domain, local, name }) => ({ address, domain, local, name });

export const isEmailAddress = (str) => Boolean(parseEmailAddress(str));
export const isEmailLocalPart = (str) => Boolean(parseEmailAddress(`${str || ''}@example.com`));

export const parseEmailAddress = (str) => {
  const result = emailAddresses.parseOneAddress(str);

  if (result === null) {
    return null;
  }

  return parts(result);
};

export const parseEmailAddresses = (str) => {
  const result = emailAddresses.parseAddressList(str);

  if (result === null) {
    return null;
  }

  return result.map(parts);
};
