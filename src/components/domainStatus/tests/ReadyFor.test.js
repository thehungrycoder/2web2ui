import { shallow } from 'enzyme';
import React from 'react';

import ReadyFor from '../ReadyFor';

describe('Component: Ready For', () => {

  it('should render null when all flags are false', () => {
    expect(shallow(<ReadyFor />)).toMatchSnapshot();
  });

  it('should render sending and dkim ready', () => {
    expect(shallow(<ReadyFor sending dkim/>)).toMatchSnapshot();
  });

  it('should render bounce ready', () => {
    expect(shallow(<ReadyFor bounce/>)).toMatchSnapshot();
  });

  it('should render bounce as default ready', () => {
    expect(shallow(<ReadyFor bounce bounceDefault/>)).toMatchSnapshot();
  });

  it('should render bounce as subaccount default ready', () => {
    expect(shallow(<ReadyFor bounce bounceDefault subaccount={101} />)).toMatchSnapshot();
  });
});
