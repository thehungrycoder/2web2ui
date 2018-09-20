import {
  isEmailAddress,
  isEmailLocalPart,
  isRecipientEmailAddress,
  parseRecipientEmailAddress,
  parseRecipientEmailAddresses
} from '../email';

describe('Email Helper', () => {
  describe('.isEmailAddress', () => {
    it('returns false when undefined', () => {
      expect(isEmailAddress(undefined)).toEqual(false);
    });

    it('returns false when invalid email address', () => {
      expect(isEmailAddress('')).toEqual(false);
    });

    it('returns false when invalid email address has no domain', () => {
      expect(isEmailAddress('mark@')).toEqual(false);
    });

    it('returns false when valid email address with name', () => {
      expect(isEmailAddress('"Mark Wahlberg" <mark@example.com>')).toEqual(false);
    });

    it('returns false when valid email address contains 8-bit characters', () => {
      expect(isEmailAddress('marká@example.com')).toEqual(false);
    });

    it('returns true when valid email address', () => {
      expect(isEmailAddress('mark@example.com')).toEqual(true);
    });

    it('returns true when valid email address has tags', () => {
      expect(isEmailAddress('mark+tag@example.com')).toEqual(true);
    });
  });

  describe('.isEmailLocalPart', () => {
    it('returns false when undefined', () => {
      expect(isEmailLocalPart(undefined)).toEqual(false);
    });

    it('returns false when invalid email local part', () => {
      expect(isEmailLocalPart('')).toEqual(false);
    });

    it('returns true when valid email local part', () => {
      expect(isEmailLocalPart('mark')).toEqual(true);
    });
  });

  describe('isRecipientEmailAddress', () => {
    it('returns false when undefined', () => {
      expect(isRecipientEmailAddress(undefined)).toEqual(false);
    });

    it('returns false when invalid email address', () => {
      expect(isRecipientEmailAddress('')).toEqual(false);
    });

    it('returns false when invalid email address has no domain', () => {
      expect(isRecipientEmailAddress('mark@')).toEqual(false);
    });

    it('returns true when valid email address with name', () => {
      expect(isRecipientEmailAddress('"Mark Wahlberg" <mark@example.com>')).toEqual(true);
    });

    it('returns true when valid email address contains 8-bit characters', () => {
      expect(isRecipientEmailAddress('marká@example.com')).toEqual(true);
    });

    it('returns true when valid email address', () => {
      expect(isRecipientEmailAddress('mark@example.com')).toEqual(true);
    });

    it('returns true when valid email address has tags', () => {
      expect(isRecipientEmailAddress('mark+tag@example.com')).toEqual(true);
    });
  });

  describe('.parseRecipientEmailAddress', () => {
    it('returns null when undefined', () => {
      expect(parseRecipientEmailAddress(undefined)).toBeNull();
    });

    it('returns null when invalid email address string', () => {
      expect(parseRecipientEmailAddress('')).toBeNull();
    });

    it('returns null when invalid email address has no domain', () => {
      expect(parseRecipientEmailAddress('marká@')).toBeNull();
    });

    it('returns null when invalid email address has no top level domain', () => {
      expect(parseRecipientEmailAddress('marká@example')).toBeNull();
    });

    it('returns an email address object', () => {
      expect(parseRecipientEmailAddress('marká@example.com')).toMatchSnapshot();
    });

    it('returns an email address object with name', () => {
      expect(parseRecipientEmailAddress('"Mark Wahlberg" <marká@example.com>')).toMatchSnapshot();
    });
  });

  describe('.parseRecipientEmailAddresses', () => {
    it('returns null when undefined', () => {
      expect(parseRecipientEmailAddresses(undefined)).toBeNull();
    });

    it('returns null when invalid email address', () => {
      expect(parseRecipientEmailAddresses('')).toBeNull();
    });

    it('returns null when multiple invalid email addresses', () => {
      expect(parseRecipientEmailAddresses('exampe, test')).toBeNull();
    });

    it('returns null when invalid email address has no domain', () => {
      expect(parseRecipientEmailAddresses('marká@')).toBeNull();
    });

    it('returns null when invalid email address has no top level domain', () => {
      expect(parseRecipientEmailAddresses('marká@example')).toBeNull();
    });

    it('returns an email address object', () => {
      expect(parseRecipientEmailAddresses('marká@example.com')).toMatchSnapshot();
    });

    it('returns multiple email address objects', () => {
      expect(parseRecipientEmailAddresses('marká@example.com,marká@example.com')).toMatchSnapshot();
    });

    it('returns multiple email address objects with name', () => {
      const addresses = '"Mark Wahlberg" <marká@example.com>, marká@example.com';
      expect(parseRecipientEmailAddresses(addresses)).toMatchSnapshot();
    });
  });
});
