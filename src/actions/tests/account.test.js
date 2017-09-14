import { fetch, getPlans } from '../account';

test.skip('fetch - no params', () => {
  const fetchAction = fetch();
  expect(fetchAction).toMatchSnapshot();
});

test.skip('fetch with params', () => {
  const params = {
    this: 'one',
    also: 'that one'
  };
  const fetchAction = fetch(params);
  expect(fetchAction).toMatchSnapshot();
});

test.skip('getPlans', () => {
  const getPlansAction = getPlans();
  expect(getPlansAction).toMatchSnapshot();
});
