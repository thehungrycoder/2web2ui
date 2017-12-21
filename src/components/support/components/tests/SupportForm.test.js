import React from 'react';
import { shallow } from 'enzyme';

import { SupportForm } from '../SupportForm';

describe('Support Form Component', () => {
  let wrapper;

  describe('Form', () => {
    let handleSubmit;

    beforeEach(() => {
      handleSubmit = jest.fn();
      const props = { handleSubmit };
      wrapper = shallow(<SupportForm {...props} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the form by default', () => {
      expect(wrapper.find('form').exists()).toBeTruthy();
      expect(wrapper.find('.SuccessMessage')).toHaveLength(0);
    });
  });

  it('should render message on success', () => {
    const wrapper = shallow(<SupportForm submitSucceeded={true} />);
    expect(wrapper.find('.SuccessMessage')).toHaveLength(1);
    expect(wrapper.find('form').exists()).toBeFalsy();
  });

  describe('Control', () => {
    let props;
    let wrapper;
    beforeEach(() => {
      props = {
        handleSubmit: jest.fn(),
        reset: jest.fn(),
        onCancel: jest.fn(),
        onContinue: jest.fn()
      };
      wrapper = shallow(<SupportForm {...props} />);
    });

    it('should call parent on cancel', () => {
      wrapper.instance().reset(props.onCancel);
      expect(props.onCancel).toHaveBeenCalled();
    });

    it('should call parent on continue', () => {
      wrapper.instance().reset(props.onContinue);
      expect(props.onContinue).toHaveBeenCalled();
    });

    it('should cancel', () => {
      const spy = jest.spyOn(wrapper.instance(), 'reset');
      wrapper.find('.CancelBtn').simulate('click');
      expect(spy).toHaveBeenCalled();
      expect(props.onCancel).toHaveBeenCalled();
    });

    it('should continue', () => {
      props = { ...props, submitSucceeded: true };
      wrapper = shallow(<SupportForm {...props} />);
      const spy = jest.spyOn(wrapper.instance(), 'reset');
      wrapper.find('.SuccessMessage Button').simulate('click');
      expect(spy).toHaveBeenCalled();
      expect(props.onContinue).toHaveBeenCalled();
    });
  });
});
