import React from 'react';
import { shallow } from 'enzyme';
import NumericDataCell from '../NumericDataCell';

describe('NumericDataCell', () => {
  const subject = (props = {}) => shallow(
    <NumericDataCell value={123} {...props} />
  );

  it('renders a number', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders number with commas', () => {
    expect(subject({ value: 1230 })).toMatchSnapshot();
  });

  it('renders bars', () => {
    expect(subject({ value: null })).toMatchSnapshot();
  });
});
