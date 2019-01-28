import React from 'react';
import { shallow } from 'enzyme';
import WoWDataCell from '../WoWDataCell';

describe('WoWDataCell', () => {
  const subject = (props = {}) => shallow(
    <WoWDataCell value={0.1} {...props} />
  );

  it('renders a positive change', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders a negative change', () => {
    expect(subject({ value: -0.02 })).toMatchSnapshot();
  });

  it('renders no change', () => {
    expect(subject({ value: 0 })).toMatchSnapshot();
  });

  it('renders null', () => {
    expect(subject({ value: null })).toMatchSnapshot();
  });
});
