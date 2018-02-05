import React from 'react';
import { shallow } from 'enzyme';

import StatusTooltip from '../StatusTooltip';

describe('StatusTooltip component', () => {
  it('renders', () => {
    expect(shallow(<StatusTooltip />)).toMatchSnapshot();
  });

  it('renders children', () => {
    expect(shallow(<StatusTooltip>Hi there</StatusTooltip>)).toMatchSnapshot();
  });
});
