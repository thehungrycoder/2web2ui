import findRouteByPath from '../findRouteByPath';

jest.mock('src/config/routes', () => ([
  {
    path: '/a',
    title: 'A'
  },
  {
    path: '/a/nested',
    title: 'Nested A'
  },
  {
    path: '/a/:name',
    title: 'Named A'
  }
]));

describe('Helper: findRouteByPath', () => {

  it('should find a matching route', () => {
    expect(findRouteByPath('/a')).toEqual({ path: '/a', title: 'A' });
  });

  it('should ignore a trailing slash by default', () => {
    expect(findRouteByPath('/a/')).toEqual({ path: '/a', title: 'A' });
  });

  it('should find a nested route', () => {
    expect(findRouteByPath('/a/nested')).toEqual({ path: '/a/nested', title: 'Nested A' });
  });

  it('should return undefined for a non-exact match', () => {
    expect(findRouteByPath('/a/nested/other')).toEqual({});
  });

  it('should return a parameterized match', () => {
    expect(findRouteByPath('/a/joanna')).toEqual({ path: '/a/:name', title: 'Named A' });
  });

  it('should allow overriding match options', () => {
    expect(findRouteByPath('/a/', { exact: true, strict: true })).toEqual({});
  });

});
