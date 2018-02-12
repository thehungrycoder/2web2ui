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
    goodInput.forEach((input) => it(`${caseName} should accept ${input}`,
      () => expect(validations[caseName](input)).toBeUndefined()));

    badInput.forEach((input) => it(`${caseName} should not accept ${input}`,
      () => expect(validations[caseName](input)).toBeDefined()));
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
