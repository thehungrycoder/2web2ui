import hasGrants from '../hasGrants';

it('should return a function', () => {
  expect(hasGrants('some/grant1')).toEqual(expect.any(Function));
});

it('should return a function that returns true if a single grant is included in the state list', () => {
  const condition = hasGrants('some/grant1');
  const state = {
    currentUser: {
      grants: [{ key: 'some/grant1' }, { key: 'other/grant2' }]
    }
  };
  expect(condition(state)).toEqual(true);
});

it('should return a function that returns true if multiple grants are all included in the state list', () => {
  const condition = hasGrants('some/grant1', 'other/grant2');
  const state = {
    currentUser: {
      grants: [{ key: 'some/grant1' }, { key: 'other/grant2' }, { key: 'another/grant3' }]
    }
  };
  expect(condition(state)).toEqual(true);
});

it('should return a function that returns false if any required grant is not included in the state list', () => {
  const condition = hasGrants('some/grant1', 'bzzt/nogrant');
  const state = {
    currentUser: {
      grants: [{ key: 'some/grant1' }, { key: 'other/grant2' }, { key: 'another/grant3' }]
    }
  };
  expect(condition(state)).toEqual(false);
});
