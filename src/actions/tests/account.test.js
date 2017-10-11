import { fetch, getPlans } from '../account';

test('fetch - no params', () => {
  const fetchAction = fetch();
  expect(fetchAction).toMatchSnapshot();
});

test('fetch with params', () => {
  const params = {
    this: 'one',
    also: 'that one'
  };
  const fetchAction = fetch(params);
  expect(fetchAction).toMatchSnapshot();
});

test('getPlans', () => {
  const getPlansAction = getPlans();
  expect(getPlansAction).toMatchSnapshot();
});
