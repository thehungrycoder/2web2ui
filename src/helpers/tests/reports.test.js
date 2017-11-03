import * as reports from '../reports';

it('Should get search options', () => {
  const filters = {
    from: 1487076708000,
    to: 1587076708000,
    activeList: [
      { type: 'type', value: '123'}
    ]
  };
  expect(reports.getFilterSearchOptions(filters)).toMatchSnapshot();
});

it('Should get search string', () => {
  const options = {
    one: 'two',
    three: 'four'
  };
  expect(reports.getSearch(options)).toEqual('?one=two&three=four');
});

it('Should not return anything with no options', () => {
  expect(reports.getSearch({})).toEqual('');
});

it('Should get share link', () => {
  const options = {
    one: 'two',
    three: 'four'
  };
  // window location set in jest config
  expect(reports.getShareLink(options)).toEqual('http://phoenix.test/?one=two&three=four');
});
