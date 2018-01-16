import a from '../A';
import * as mockB from '../B';

jest.mock('../B');

describe('Test mocking', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should let dependencies be mocked', () => {
    expect(a('hi')).toEqual('hi undefined undefined');
  });

  it('should control a default export', () => {
    mockB.default = jest.fn(() => 'mocked default');
    expect(a('hi')).toEqual('hi undefined mocked default');
  });

  it('should control a named export', () => {
    mockB.b1 = jest.fn(() => 'mocked named');
    expect(a('hi')).toEqual('hi mocked named undefined');
  });

});
