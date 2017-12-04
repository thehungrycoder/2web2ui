import React from 'react';
import { shallow } from 'enzyme';
import StatusTag from '../StatusTag';

describe('Component: Tracking Domains Status Tag', () => {

  it('should render for blocked status', () => {
    expect(shallow(<StatusTag status='blocked' />)).toMatchSnapshot();
  });

  it('should render for pending status', () => {
    expect(shallow(<StatusTag status='pending' />)).toMatchSnapshot();
  });

  it('should render for unverified status', () => {
    expect(shallow(<StatusTag status='unverified' />)).toMatchSnapshot();
  });

  it('should render null for any other status', () => {
    expect(shallow(<StatusTag status='verified' />)).toMatchSnapshot();
    expect(shallow(<StatusTag status='unknown' />)).toMatchSnapshot();
    expect(shallow(<StatusTag status='whatever' />)).toMatchSnapshot();
    expect(shallow(<StatusTag status={100} />)).toMatchSnapshot();
    expect(shallow(<StatusTag status={true} />)).toMatchSnapshot();
  });

});
