import { shallow } from 'enzyme';
import React from 'react';
import EnableTfaModal from '../EnableTfaModal';

describe('EnableTfaModal tests', () => {
  function subject(props) {
    const baseProps = {
      open: false,
      onClose: jest.fn(),
      enabled: false,
      onEnable: jest.fn()
    };
    return shallow(<EnableTfaModal {...baseProps} {...props} />);
  }

  it('should render correctly', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('should close after enable', () => {
    const wrapper = subject();
    wrapper.setProps({ open: true, enabled: true });
    wrapper.update();
    expect(wrapper.instance().props.onClose).toHaveBeenCalled();
  });
});
