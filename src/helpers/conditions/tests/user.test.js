import { notHeroku, notAzure } from '../user';

describe('User Condition Tests', () => {
  it('should return true if user is not heroku', () => {
    const currentUser = { access_level: 'nerfed' };
    expect(notHeroku()({ currentUser })).toEqual(true);
  });

  it('should return false if user is heroku', () => {
    const currentUser = { access_level: 'heroku' };
    expect(notHeroku()({ currentUser })).toEqual(false);
  });

  it('should return true if user is not azure', () => {
    const currentUser = { access_level: 'nerfed' };
    expect(notAzure()({ currentUser })).toEqual(true);
  });

  it('should return false if user is azure', () => {
    const currentUser = { access_level: 'azure' };
    expect(notAzure()({ currentUser })).toEqual(false);
  });
});
