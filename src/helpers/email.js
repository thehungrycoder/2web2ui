// Must use email-addresses to support 8-bit character sets, RFC6532
// see, https://tools.ietf.org/html/rfc6532
import emailAddresses from 'email-addresses';

const DEFAULT_OPTIONS = {
  // requires top level domain
  // see, https://github.com/jackbearheart/email-addresses#obj--addrsopts
  rejectTLD: true
};

// standardize the record structure
const parts = ({ address, domain, local, name }) => ({ address, domain, local, name });

export const isEmailAddress = (str) => Boolean(parseEmailAddress(str));
export const isEmailLocalPart = (str) => Boolean(parseEmailAddress(`${str || ''}@example.com`));

// todo, remove try/catch when v3.0.2 is released
// see, https://github.com/jackbearheart/email-addresses/issues/39
export const parseEmailAddress = (input) => {
  let result;

  try {
    result = emailAddresses.parseOneAddress({ ...DEFAULT_OPTIONS, input });
  } catch (error) {
    return null;
  }

  if (result === null) {
    return null;
  }

  return parts(result);
};

// todo, remove try/catch when v3.0.2 is released
// see, https://github.com/jackbearheart/email-addresses/issues/39
export const parseEmailAddresses = (input) => {
  let result;

  try {
    result = emailAddresses.parseAddressList({ ...DEFAULT_OPTIONS, input });
  } catch (error) {
    return null;
  }

  if (result === null) {
    return null;
  }

  return result.map(parts);
};
