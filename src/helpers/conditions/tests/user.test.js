import { isAdmin, isHeroku, isAzure, isSso, hasRole, isUserUiOptionSet, isSubaccountUser } from '../user';

import cases from 'jest-in-case';

describe('User Condition Tests', () => {
  it('should return true if user is heroku', () => {
    const currentUser = { access_level: 'heroku' };
    expect(isHeroku({ currentUser })).toEqual(true);
  });

  it('should return false if user is not heroku', () => {
    const currentUser = { access_level: 'klurgen' };
    expect(isHeroku({ currentUser })).toEqual(false);
  });

  it('should return true if user is azure', () => {
    const currentUser = { access_level: 'azure' };
    expect(isAzure({ currentUser })).toEqual(true);
  });

  it('should return false if user is not azure', () => {
    const currentUser = { access_level: 'blargh' };
    expect(isAzure({ currentUser })).toEqual(false);
  });

  it('should return true if user is an admin', () => {
    const currentUser = { access_level: 'admin' };
    expect(isAdmin({ currentUser })).toEqual(true);
  });

  it('should return true if user is a superuser', () => {
    const currentUser = { access_level: 'superuser' };
    expect(isAdmin({ currentUser })).toEqual(true);
  });

  it('should return false if user is not an admin', () => {
    const currentUser = { access_level: 'reporting' };
    expect(isAdmin({ currentUser })).toEqual(false);
  });

  it('should return true if user is sso', () => {
    const currentUser = { is_sso: true };
    expect(isSso({ currentUser })).toEqual(true);
  });

  it('should return false if user is sso', () => {
    const currentUser = { is_sso: false };
    expect(isSso({ currentUser })).toEqual(false);
  });

  it('should return true if access level matches', () => {
    const currentUser = { access_level: 'admin' };
    expect(hasRole('admin')({ currentUser })).toEqual(true);
  });

  it('should return true if user is subaccount user', () => {
    const currentUser = { access_level: 'subaccount-testing' };
    expect(isSubaccountUser({ currentUser })).toEqual(true);
  });

  it('should return false if user is not subaccount user', () => {
    const currentUser = { access_level: 'admin' };
    expect(isSubaccountUser({ currentUser })).toEqual(false);
  });

  it('should return true if access level does not match', () => {
    const currentUser = { access_level: 'reporting' };
    expect(hasRole('admin')({ currentUser })).toEqual(false);
  });

  describe('Condition: isUiOptionSet', () => {
    cases('isUiOptionSet', (opts) => {
      const state = { currentUser: { options: { ui: opts.options }}};
      expect(isUserUiOptionSet('option', opts.defaultVal)(state)).toEqual(opts.result);
    }, {
      // User option takes precedence
      'User option precedence: false/false=false': { options: { option: false }, defaultVal: false, result: false },
      'User option precedence: true/false=true': { options: { option: true }, defaultVal: false, result: true },
      'User option precedence: false/true=false': { options: { option: false }, defaultVal: true, result: false },
      'User option precedence: true/true=true': { options: { option: true }, defaultVal: true, result: true },
      // Default used iff option is missing
      'Default: true=true': { options: {}, defaultVal: true, result: true },
      'Default: false=false': { options: {}, defaultVal: false, result: false }
    });
  });
});
