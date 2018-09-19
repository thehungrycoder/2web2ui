import {
  isEmailAddress,
  isEmailLocalPart,
  parseEmailAddress,
  parseEmailAddresses
} from '../email';

describe('Email Helper', () => {
  describe('.isEmailAddress', () => {
    it('returns false when undefined', () => {
      expect(isEmailAddress(undefined)).toEqual(false);
    });

    it('returns false when invalid email address', () => {
      expect(isEmailAddress('')).toEqual(false);
    });

    it('returns false when invalid email address has no top level domain', () => {
      expect(isEmailAddress('marká@example')).toEqual(false);
    });

    it('returns true when valid email address', () => {
      expect(isEmailAddress('marká@example.com')).toEqual(true);
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
      expect(isEmailLocalPart('marká')).toEqual(true);
    });
  });

  describe('.parseEmailAddress', () => {
    it('returns null when undefined', () => {
      expect(parseEmailAddress(undefined)).toBeNull();
    });

    it('returns null when invalid email address string', () => {
      expect(parseEmailAddress('')).toBeNull();
    });

    it('returns null when invalid email address has no top level domain', () => {
      expect(parseEmailAddress('marká@example')).toBeNull();
    });

    it('returns an email address object', () => {
      expect(parseEmailAddress('marká@example.com')).toMatchSnapshot();
    });

    it('returns an email address object with name', () => {
      expect(parseEmailAddress('"Mark Wahlberg" <marká@example.com>')).toMatchSnapshot();
    });
  });

  describe('.parseEmailAddresses', () => {
    it('returns null when undefined', () => {
      expect(parseEmailAddresses(undefined)).toBeNull();
    });

    it('returns null when invalid email address', () => {
      expect(parseEmailAddresses('')).toBeNull();
    });

    it('returns null when multiple invalid email addresses', () => {
      expect(parseEmailAddresses('exampe, test')).toBeNull();
    });

    it('returns null when invalid email address has no top level domain', () => {
      expect(parseEmailAddresses('marká@example')).toBeNull();
    });

    it('returns an email address object', () => {
      expect(parseEmailAddresses('marká@example.com')).toMatchSnapshot();
    });

    it('returns multiple email address objects', () => {
      expect(parseEmailAddresses('marká@example.com,marká@example.com')).toMatchSnapshot();
    });

    it('returns multiple email address objects with name', () => {
      const addresses = '"Mark Wahlberg" <marká@example.com>, marká@example.com';
      expect(parseEmailAddresses(addresses)).toMatchSnapshot();
    });
  });
});
