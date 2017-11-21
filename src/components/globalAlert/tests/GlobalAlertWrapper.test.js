import React from 'react';
import { GlobalAlertWrapper } from '../GlobalAlertWrapper';
import { shallow } from 'enzyme';

describe('GlobalAlertWrapper', () => {
  const props = {
    alerts: [{
      message: 'a message',
      date: 'date'
    }],
    clear: jest.fn()
  };

  it('should render', () => {
    const wrapper = shallow(<GlobalAlertWrapper {...props} />)
    expect(wrapper).toMatchSnapshot();
  });

  it('should clear', () => {
    const wrapper = shallow(<GlobalAlertWrapper {...props} />)
    wrapper.find('Alert').simulate('dismiss');
    expect(props.clear).toHaveBeenCalledWith(0);
  });
});
