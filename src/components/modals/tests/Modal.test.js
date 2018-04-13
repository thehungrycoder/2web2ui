import React from 'react';
import Modal from '../Modal';
import { shallow } from 'enzyme';

describe('Modal Component', () => {
  let wrapper;

  const props = {
    open: false,
    onClose: jest.fn()
  };

  beforeEach(() => {
    wrapper = shallow(<Modal {...props}>content</Modal>);
  });

  it('should not render contents when not open', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Modal').dive().find('TransitionGroup').children()).toHaveLength(0);
  });

  it('should render contents when open', () => {
    wrapper.setProps({ open: true });
    expect(wrapper.find('Modal').dive().find('TransitionGroup').children()).toMatchSnapshot();
  });
});
