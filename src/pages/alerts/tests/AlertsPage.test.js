import { shallow } from 'enzyme';
import React from 'react';
import { AlertsPage } from '../AlertsPage';

describe('Page: Alerts', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<AlertsPage/>);
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
