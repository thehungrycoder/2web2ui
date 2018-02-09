import { mockStore } from 'src/__testHelpers__';
import csvFileParseRequest, { hasData, hasField } from '../csvFileParseRequest';

describe('csvFileParseRequest', () => {
  const dispatchThunk = (parse) => mockStore.dispatch(
    csvFileParseRequest({ type: 'PARSE_CSV', meta: {}, parser: { parse }})
  );

  beforeEach(() => { mockStore.clearActions(); });

  it('parses successfully', async() => {
    const data = [{ a: 1, b: 2, c: 3 }];
    const mockParse = (file, options) => options.complete({ data, errors: []});

    await expect(dispatchThunk(mockParse)).resolves.toEqual(data);
    expect(mockStore.getActions()).toMatchSnapshot();
  });

  it('fails to parse', async() => {
    const mockParse = (file, options) => options.complete({
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
    const mockParse = (file, options) => options.error(error);

    await expect(dispatchThunk(mockParse)).rejects.toThrowError(error);
    expect(mockStore.getActions()).toMatchSnapshot();
  });
});

describe('csvFileParseRequest.hasData', () => {
  it('returns error message', () => {
    const data = [];
    expect(hasData({ data })).toMatch(/no data/i);
  });

  it('returns undefined', () => {
    const data = [{ a: 1, b: 2, c: 3 }];
    expect(hasData({ data })).toBeUndefined();
  });
});

describe('csvFileParseRequest.hasField', () => {
  it('returns error message', () => {
    const meta = {
      fields: ['email', 'type']
    };
    expect(hasField('recipient')({ meta })).toMatch(/missing .* recipient/i);
  });

  it('returns undefined when field is found', () => {
    const meta = {
      fields: ['email', 'type']
    };
    expect(hasField('email')({ meta })).toBeUndefined();
  });

  it('returns undefined when optional field is found', () => {
    const meta = {
      fields: ['email', 'type']
    };
    expect(hasField('recipient', 'email')({ meta })).toBeUndefined();
  });
});
