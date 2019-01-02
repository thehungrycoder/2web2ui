import React from 'react';
import { shallow } from 'enzyme';
import PercentDataCell from '../PercentDataCell';

describe('PercentDataCell', () => {
  const subject = (props = {}) => shallow(
    <PercentDataCell value={0.05} {...props} />
  );

  it('renders a percentage', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders bars', () => {
    expect(subject({ value: null })).toMatchSnapshot();
  });
});
