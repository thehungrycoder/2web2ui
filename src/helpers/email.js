// Must use email-addresses to support 8-bit character sets, RFC6532
// see, https://tools.ietf.org/html/rfc6532
import emailAddresses from 'email-addresses';

const EMAIL_ADDRESS_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
const EMAIL_LOCAL_PART_REGEX = /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+$/i;

// standardize the record structure
const parts = ({ address, domain, local, name }) => ({ address, domain, local, name });

export const isEmailAddress = (str) => EMAIL_ADDRESS_REGEX.test(str || '');
export const isEmailLocalPart = (str) => EMAIL_LOCAL_PART_REGEX.test(str || '');
export const isRecipientEmailAddress = (str) => Boolean(parseRecipientEmailAddress(str));

// todo, remove try/catch when v3.0.2 is released
// see, https://github.com/jackbearheart/email-addresses/issues/39
export const parseRecipientEmailAddress = (input) => {
  let result;

  try {
    result = emailAddresses.parseOneAddress({ input, rejectTLD: true, rfc6532: true });
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
export const parseRecipientEmailAddresses = (input) => {
  let result;

  try {
    result = emailAddresses.parseAddressList({ input, rejectTLD: true, rfc6532: true });
  } catch (error) {
    return null;
  }

  if (result === null) {
    return null;
  }

  return result.map(parts);
};
