import React from 'react';
import { shallow } from 'enzyme';
import { AccountSettingsPage } from '../AccountSettingsPage';

describe('AccountSettingsPage', () => {
  it('renders', () => {
    const props = {
      currentUser: {
        customer: 123123
      }
    };
    const wrapper = shallow(<AccountSettingsPage {...props} />);

    expect(wrapper).toMatchSnapshot();
  });
});
