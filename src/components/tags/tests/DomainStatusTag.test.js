import React from 'react';
import { shallow } from 'enzyme';
import DomainStatusTag from '../DomainStatusTag';

describe('Component: DomainStatusTag', () => {

  it('should render for blocked status', () => {
    expect(shallow(<DomainStatusTag status='blocked' />)).toMatchSnapshot();
  });

  it('should render for pending status', () => {
    expect(shallow(<DomainStatusTag status='pending' />)).toMatchSnapshot();
  });

  it('should render for unverified status', () => {
    expect(shallow(<DomainStatusTag status='unverified' />)).toMatchSnapshot();
  });

  it('should render for verified status', () => {
    expect(shallow(<DomainStatusTag status='verified' />)).toMatchSnapshot();
  });

  it('should render null without status', () => {
    expect(shallow(<DomainStatusTag />)).toMatchSnapshot();
  });

});
