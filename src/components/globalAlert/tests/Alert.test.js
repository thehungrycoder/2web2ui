import React from 'react';
import Alert from '../Alert';
import { shallow } from 'enzyme';

describe('Alert', () => {
  window.setTimeout = jest.fn((a) => a);
  window.clearTimeout = jest.fn((a) => a);

  const props = {
    autoDismiss: true,
    timeoutInterval: 500,
    message: 'message',
    type: 'error',
    details: 'details',
    onDismiss: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Alert {...props} />);
  });

  it('should render with all props', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('a')).toHaveLength(1);
  });

  it('should render without an action or details', () => {
    wrapper.setProps({ details: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a provided action', () => {
    wrapper.setProps({
      details: null,
      action: { content: 'action content', onClick: jest.fn() }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle action on click', () => {
    wrapper.setProps({
      details: null,
      action: { content: 'action content', onClick: jest.fn() }
    });
    wrapper.find('a').simulate('click');
    expect(wrapper.instance().props.action.onClick).toHaveBeenCalled();
  });

  it('should handle details click', () => {
    wrapper.find('a').simulate('click');
    expect(wrapper).toMatchSnapshot();
    expect(wrapper).toHaveState('showDetails', true);
    expect(wrapper.instance().timeout).not.toBe(null);

    // refresh
    expect(window.clearTimeout).toHaveBeenCalledWith(wrapper.instance().timeout);
    expect(window.setTimeout).toHaveBeenCalledWith(wrapper.instance().handleDismiss, props.timeoutInterval);
  });

  it('should handle dismiss', () => {
    wrapper.find('Snackbar').simulate('dismiss');
    expect(props.onDismiss).toHaveBeenCalled();
  });
});
