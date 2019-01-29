import React from 'react';
import { shallow } from 'enzyme';
import WoWDataCell from '../WoWDataCell';

describe('WoWDataCell', () => {
  const subject = (props = {}) => shallow(
    <WoWDataCell {...props} />
  );

  it('renders a positive change', () => {
    expect(subject({ value: 0.1 })).toMatchSnapshot();
  });

  it('renders a negative change', () => {
    expect(subject({ value: -0.02 })).toMatchSnapshot();
  });

  it('renders no change', () => {
    expect(subject({ value: 0 })).toMatchSnapshot();
  });

  it('renders a negative change when reversed', () => {
    expect(subject({ value: -0.02, reverse: true })).toMatchSnapshot();
  });

  it('renders a positive change when reversed', () => {
    expect(subject({ value: 0.1, reverse: true })).toMatchSnapshot();
  });

  it('renders null', () => {
    expect(subject({ value: null })).toMatchSnapshot();
  });
});
