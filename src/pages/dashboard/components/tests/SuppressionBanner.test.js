import { shallow } from 'enzyme';
import React from 'react';

import SuppressionBanner from '../SuppressionBanner';

describe('Component: Suppression Banner', () => {
  const props = {
    accountAgeInWeeks: 10,
    hasSuppressions: false
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SuppressionBanner {...props} />);
  });

  it('should show banner when account is older than 1 week and have 0 suppressions', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render null when account is newer than a week', () => {
    wrapper.setProps({ accountAgeInWeeks: 0 });
    expect(wrapper).toMatchSnapshot();
  });

});
