import { shallow } from 'enzyme';
import React from 'react';
import OverviewHelpCopy from '../OverviewHelpCopy';

describe('Signals OverviewHelpCopy Component', () => {
  it('renders correctly', () => {
    expect(shallow(<OverviewHelpCopy />)).toMatchSnapshot();
  });
});
