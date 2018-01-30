import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import VerificationHelp from '../VerificationHelp';

import { verificationCases } from '../../tests/domain';

describe('VerificationHelp component', () => {
  cases('renders for non-verified domains', (status) => {
    expect(shallow(<VerificationHelp status={status} />)).toMatchSnapshot();
  }, verificationCases);

  it('does not render otherwise', () => {
    expect(shallow(<VerificationHelp status='verified' />)).toMatchSnapshot();
  });
});
