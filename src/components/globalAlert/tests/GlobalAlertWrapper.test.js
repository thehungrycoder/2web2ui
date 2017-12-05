import React from 'react';
import { GlobalAlertWrapper } from '../GlobalAlertWrapper';
import { shallow } from 'enzyme';

describe('GlobalAlertWrapper', () => {
  const props = {
    alerts: [{
      message: 'a message',
      id: 'alert_1'
    }],
    clear: jest.fn()
  };

  it('should render', () => {
    const wrapper = shallow(<GlobalAlertWrapper {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should clear', () => {
    const wrapper = shallow(<GlobalAlertWrapper {...props} />);
    wrapper.find('Alert').simulate('dismiss');
    expect(props.clear).toHaveBeenCalledWith('alert_1');
  });
});
