import React from 'react';
import { shallow } from 'enzyme';
import UnverifiedBanner from '../UnverifiedBanner';

describe('Component: UnverifiedBanner', () => {

  it('should render nothing with no unverified domains', () => {
    expect(shallow(<UnverifiedBanner unverifiedDomains={[]} />)).toMatchSnapshot();
  });

  it('should render correctly with 1 unverified domain', () => {
    expect(shallow(<UnverifiedBanner unverifiedDomains={['unverified.com']} />)).toMatchSnapshot();
  });

  it('should render correctly with more than 1 unverified domain', () => {
    expect(shallow(<UnverifiedBanner unverifiedDomains={[
      'unverified1.com',
      'unverified2.com'
    ]} />)).toMatchSnapshot();
  });

});
