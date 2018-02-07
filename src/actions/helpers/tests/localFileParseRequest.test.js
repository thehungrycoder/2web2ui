import { mockStore } from 'src/__testHelpers__';
import localFileParseRequest from '../localFileParseRequest';

describe('localFileParseRequest', () => {
  const dispatchThunk = (parse) => mockStore.dispatch(
    localFileParseRequest({ type: 'PARSE_CSV', meta: {}, parser: { parse }})
  );

  beforeEach(() => { mockStore.clearActions(); });

  it('parses successfully', async() => {
    const data = [{ a: 1, b: 2, c: 3 }];
    const mockParse = (file, options) => options.complete({ data, errors: []});

    await expect(dispatchThunk(mockParse)).resolves.toEqual(data);
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('fails to parse', async() => {
    const mockParse = (_file, options) => options.complete({
      errors: [
        { message: 'Oh no', row: 1 },
        { message: 'Oh no', row: 2 }
      ]
    });

    await expect(dispatchThunk(mockParse)).rejects.toThrowError(/while parsing/);
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('fails to read file', async() => {
    const error = new Error('Oh no!');
    const mockParse = (_file, options) => options.error(error);

    await expect(dispatchThunk(mockParse)).rejects.toThrowError(error);
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});
