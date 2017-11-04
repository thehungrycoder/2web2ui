import * as reports from '../reports';

it('Should get search options', () => {
  const filters = {
    from: 1487076708000,
    to: 1587076708000,
    activeList: [
      { type: 'type', value: '123' }
    ]
  };
  expect(reports.getFilterSearchOptions(filters)).toMatchSnapshot();
});

it('Should get share link with no options', () => {
  expect(reports.getShareLink({})).toMatchSnapshot();
});

it('Should get share link', () => {
  const options = {
    one: 'two',
    three: 'four'
  };
  // window location set in jest config
  expect(reports.getShareLink(options)).toMatchSnapshot();
});

it('Should parse search', () => {
  const filters = 'filters=Domain:test.com&filters=Subaccount:test:123';
  const date = 'from=2017-11-03T14:43:00Z&to=2017-11-04T14:43:00Z';
  const metrics = 'metrics=count-something';
  const search = `?${filters}&${date}&${metrics}`;
  expect(reports.parseSearch(search)).toMatchSnapshot();
});

it('Should parse search with no empty value', () => {
  expect(reports.parseSearch('')).toMatchSnapshot();
});
