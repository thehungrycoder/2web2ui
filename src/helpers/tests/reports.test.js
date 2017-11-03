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



it('Should get share link', () => {
  Object.defineProperty(window.location, 'href', {
    value: 'test.com?not=this',
    writable: true,
  });
  const options = {
    one: 'two',
    three: 'four'
  };
  expect(reports.getShareLink(options)).toEqual('test.com?one=two&three=four');
});
