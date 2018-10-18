import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import JoinError from '../JoinError';

describe('JoinError', () => {
  let data;

  beforeEach(() => {
    data = {
      first_name: 'foo',
      last_name: 'bar',
      email: 'foo@bar.com'
    };
  });

  const testCases = [
    { name: 'captcha error', message: 'must provide recaptcha error', status: 400 },
    { name: 'invalid email (400)', message: 'invalid email', status: 400 },
    { name: 'invalid email (403)', message: 'invalid email', status: 403 },
    { name: 'aws account exists', message: 'AWS Account already exists', status: 409 },
    { name: 'duplicate email', message: 'A user with that email address already exists', status: 409 },
    { name: 'manual review required (siftscience)', message: 'Sign up blocked', status: 403 },
    { name: 'service not available in location', message: 'forbidden', status: 403 },
    { name: 'no status', message: 'some error', status: null }
  ];

  cases('render: ', (opts) => {
    const response = {
      response: {
        status: opts.status,
        data: {
          errors: [{ message: opts.message }]
        }
      }
    };

    expect(shallow(<JoinError errors={response} data={data} />)).toMatchSnapshot();
  }, testCases);

  it('it returns generic error on all other cases', () => {
    expect(shallow(<JoinError errors={{}} data={data} />)).toMatchSnapshot();
    expect(true).toBe(false);
  });
});
