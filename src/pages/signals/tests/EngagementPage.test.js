import { shallow } from 'enzyme';
import React from 'react';
import { EngagementPage } from '../EngagementPage';

describe('Signals Engagement Cohort Page', () => {
  let wrapper;

  beforeEach(() => {
    const props = {};
    wrapper = shallow(<EngagementPage {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
