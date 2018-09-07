import React from 'react';
import { shallow } from 'enzyme';
import AccountSettingsPage from '../AccountSettingsPage';

describe('AccountSettingsPage', () => {
  it('renders', () => {
    const wrapper = shallow(<AccountSettingsPage />);
    expect(wrapper).toMatchSnapshot();
  });
});
