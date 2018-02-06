import React from 'react';
import { shallow } from 'enzyme';

import { VerifiedIcon, ErrorIcon } from '../Icons';

describe('Sending Domains Icons', () => {
  it('render correctly', () => {
    expect(shallow(<VerifiedIcon />)).toMatchSnapshot();
    expect(shallow(<ErrorIcon />)).toMatchSnapshot();
  });
});
