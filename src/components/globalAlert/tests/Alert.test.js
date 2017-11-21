import React from 'react';
import Alert from '../Alert';
import { shallow } from 'enzyme';

describe('Alert', () => {
  const props = {
    autoDismiss: true,
    message: 'message',
    type: 'error',
    details: 'details',
    onDismiss: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Alert {...props} />)
  });

  it('should render with all props', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('a').length).toEqual(1);
  });

  it('should handle details click', () => {
    wrapper.find('a').simulate('click')
    expect(wrapper).toMatchSnapshot();
    expect(wrapper).toHaveState('showDetails', true);
    expect(wrapper.instance().timeout).not.toBe(null)
  });

  it('should handle delete', () => {
    wrapper.instance().handleDismiss();
    expect(props.onDismiss).toHaveBeenCalled();
  });
});
