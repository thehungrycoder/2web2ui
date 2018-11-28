import { shallow } from 'enzyme';
import React from 'react';
import { OverviewPage } from '../OverviewPage';

describe('Signals Overview Page', () => {
  let wrapper;

  beforeEach(() => {
    const props = {};
    wrapper = shallow(<OverviewPage {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
