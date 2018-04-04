import React from 'react';
import { shallow } from 'enzyme';

import { RedirectAndAlert } from '../RedirectAndAlert';

describe('RedirectAndAlert', () => {
  const props = {
    alert: { message: 'Shhh', type: 'warning' },
    showAlert: jest.fn(),
    to: '/test/example'
  };
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<RedirectAndAlert {...props} />);
  });

  it('should render a redirect', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show alert', () => {
    expect(props.showAlert).toHaveBeenCalledWith(props.alert);
  });
});
