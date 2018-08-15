import * as validations from '../validation';

/*
 * cases and memoizedCases each include a key per function under test with
 * good and bad inputs.
 *
 * Each good input is passed to the function and the result is expected toBeUndefined().
 *
 * Each bad input is passed to the function and the result is expected toBeDefined().
 *
 */

const cases = {
  required: {
    good: ['101', 1, {}, []],
    bad: [null, undefined]
  },
  email: {
    good: ['roberto@baggio.example.com', 'x@example.com'],
    bad: ['bugblatter', 'not.an.email.example.com']
  },
  emailLocal: {
    good: ['roberto.baggio', '101'],
    bad: ['@', 'you@example.com']
  },
  domain: {
    good: ['example.com', 'xo.co'],
    bad: ['101', 'no_capes']
  },
  nonEmptyFile: {
    good: [{ size: 1 }, null],
    bad: [{ size: 0 }]
  },
  integer: {
    good: ['-10', '-1', '0', '1', '109352', -10, -1, 0, 1, 109352],
    bad: [-498.2, 0.1, 39.2, 'bob', '', '-498.2', '0.1', '39.2']
  },
  startTimeAfterNow: {
    good: [{ from: '2040-08-20T19:50:00.000Z' }],
    bad: [{ from: '2000-08-20T19:50:00.000Z' }]
  },
  abTestId: {
    good: ['id', 'test-id', 'test_1', '1'],
    bad: ['test.id', 'NOT_!@#$%^&*()_VALID', 'test id', ':doge:']
  },
  abTestDefaultTemplate: {
    good: [['foobar', { subaccount: true }, { templates: ['foo', 'bar', 'foobar']}]],
    bad: [['foobar', { subaccount: true }, { templates: ['foo', 'bar']}], ['foobar', { subaccount: false }, { templates: ['foo', 'bar']}]],
    multiArg: true
  },
  abTestDuration: {
    good: [[{ from: '2018-08-20T19:50:00.000Z', to: '2018-08-21T19:50:00.000Z' }, { engagement_timeout: 24 }]],
    bad: [
      [{ from: '2018-08-20T19:50:00.000Z', to: '2019-08-21T19:50:00.000Z' }, { engagement_timeout: 24 }],
      [{ from: '2018-08-20T19:50:00.000Z', to: '2018-08-21T19:50:00.000Z' }, { engagement_timeout: 2400 }]
    ],
    multiArg: true
  },
  abTestDistribution: {
    good: [
      ['sample_size', {}],
      ['percent', { default_template: { percent: 50 }, variants: [{ percent: 50 }]}],
      ['percent', { default_template: { percent: 50 }, variants: [{ percent: 50 }, undefined]}]
    ],
    bad: [['percent', { default_template: { percent: 75 }, variants: [{ percent: 75 }]}]],
    multiArg: true
  }
};

const memoizedCases = {
  fileExtension: {
    good: [['csv', { name: 'test.csv' }], ['csv', null]],
    bad: [['csv', { name: 'test.txt' }]]
  },
  maxLength: {
    good: [[1, '1'], [2, '12']],
    bad: [[1, '123']]
  },
  minLength: {
    good: [[1, '12'], [5, '1234567']],
    bad: [[2, '1'], [1, '']]
  },
  minNumber: {
    good: [[1, 1], [-10, -9], [0, 2]],
    bad: [[1, 0], [-1, -2], [0, -10]]
  },
  maxNumber: {
    good: [[1, 1], [-10, -11], [0, -1]],
    bad: [[1, 2], [-10, -9], [0, 1]]
  },
  maxFileSize: {
    // The null case below is for the redux-form validation that sometimes occurs before underlying fields are available
    good: [[1024, { size: 1000 }], [1, null]],
    bad: [[1024, { size: 1025 }]]
  }
};

describe('Validation helpers', () => {
  Object.keys(cases).forEach((caseName) => {
    const goodInput = cases[caseName].good;
    const badInput = cases[caseName].bad;
    const multiArg = !!cases[caseName].multiArg;
    goodInput.forEach((input) => it(`${caseName} should accept ${input}`,
      () => expect(validations[caseName](...multiArg ? input : [input])).toBeUndefined()));

    badInput.forEach((input) => it(`${caseName} should not accept ${input}`,
      () => expect(validations[caseName](...multiArg ? input : [input])).toBeDefined()));
  });
});

describe('Memoized validation helpers', () => {
  Object.keys(memoizedCases).forEach((caseName) => {
    const goodInput = memoizedCases[caseName].good;
    const badInput = memoizedCases[caseName].bad;
    goodInput.forEach((input) => {
      const configVars = input[0];
      const arg = input[1];
      const ctor = validations[caseName];
      const instance = ctor(configVars);
      it(`${caseName}(${configVars}) should accept ${typeof(arg)}:'${arg}'`, () => {
        expect(instance).toBeInstanceOf(Function);
        expect(instance(arg)).toBeUndefined();
      });
    });

    badInput.forEach((input) => {
      const configVars = input[0];
      const arg = input[1];
      const ctor = validations[caseName];
      const instance = ctor(configVars);
      it(`${caseName}(${configVars}) should not accept ${typeof(arg)}:'${arg}'`, () => {
        expect(instance).toBeInstanceOf(Function);
        expect(instance(arg)).toBeDefined();
      });
    });
  });
});

describe('Number between validation', () => {
  it('returns undefined for valid input', () => {
    expect(validations.numberBetween(0, 1)(0.5)).toBeUndefined();
  });

  it('returns error for invalid input', () => {
    expect(validations.numberBetween(0, 1)(0)).toEqual('Must be between 0 and 1');
  });
});

describe('URL Validation', () => {
  it('returns undefined for valid url', () => {
    expect(validations.url('http://yahoo.com')).toBeUndefined();
  });

  it('returns error for invalid url',() => {
    expect(validations.url('http://  google.com')).toEqual('Must be a valid URL');
  });
});

describe('Credit card expiration validation', () => {

  let realDate;
  const mockNow = new Date('2018-06-15T12:00:00-00:00');

  beforeEach(() => {
    realDate = Date;
    /* eslint-disable-next-line no-global-assign */
    Date = class extends Date {
      constructor(...args) {
        /* eslint-disable-next-line constructor-super */
        return (args[0] === undefined) ? mockNow : super(...args);
      }
    };
  });

  afterEach(() => {
    /* eslint-disable-next-line no-global-assign */
    Date = realDate;
  });

  it('should be valid for a date in a future year', () => {
    expect(validations.cardExpiry('05 / 19')).toBeUndefined();
    expect(validations.cardExpiry('05/19')).toBeUndefined();
    expect(validations.cardExpiry('05 / 2019')).toBeUndefined();
  });

  it('should be valid for a date in the same year, future month', () => {
    expect(validations.cardExpiry('07 / 18')).toBeUndefined();
    expect(validations.cardExpiry('07/18')).toBeUndefined();
    expect(validations.cardExpiry('07 / 2018')).toBeUndefined();
  });

  it('should be valid for a date in the same year, same month', () => {
    expect(validations.cardExpiry('06 / 18')).toBeUndefined();
    expect(validations.cardExpiry('06/18')).toBeUndefined();
    expect(validations.cardExpiry('06 / 2018')).toBeUndefined();
  });

  it('should be invalid for a date in the same year, previous month', () => {
    expect(validations.cardExpiry('05 / 18')).toEqual('Please choose a valid expiration date');
    expect(validations.cardExpiry('05/18')).toEqual('Please choose a valid expiration date');
    expect(validations.cardExpiry('05 / 2018')).toEqual('Please choose a valid expiration date');
  });

  it('should be invalid for a date in a previous year', () => {
    expect(validations.cardExpiry('12 / 17')).toEqual('Please choose a valid expiration date');
    expect(validations.cardExpiry('12/17')).toEqual('Please choose a valid expiration date');
    expect(validations.cardExpiry('12 / 2017')).toEqual('Please choose a valid expiration date');
  });

  it('should be invalid for a date with an invalid month', () => {
    expect(validations.cardExpiry('44 / 20')).toEqual('Please choose a valid expiration date');
    expect(validations.cardExpiry('44/20')).toEqual('Please choose a valid expiration date');
    expect(validations.cardExpiry('44 / 2020')).toEqual('Please choose a valid expiration date');
  });
});
