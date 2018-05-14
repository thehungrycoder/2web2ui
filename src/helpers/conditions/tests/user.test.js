import { isAdmin, isAzure, isHeroku } from '../user';

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

  it('should return false if user is not an admin', () => {
    const currentUser = { access_level: 'reporting' };
    expect(isAdmin({ currentUser })).toEqual(false);
  });
});
