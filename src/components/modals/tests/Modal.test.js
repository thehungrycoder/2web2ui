import React from 'react';
import Modal from '../Modal';
import { shallow } from 'enzyme';

describe('Modal Component', () => {
  let wrapper;

  const props = {
    open: true,
    onClose: jest.fn()
  };

  it('should render', () => {
    wrapper = shallow(<Modal {...props}>content</Modal>);
    expect(wrapper).toMatchSnapshot();
  });
});
