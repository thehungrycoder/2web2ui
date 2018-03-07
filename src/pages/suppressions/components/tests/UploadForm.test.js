import React from 'react';
import { shallow } from 'enzyme';

import { UploadForm } from '../UploadForm';

describe('UploadForm tests', () => {
  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      submitting: false,
      handleSubmit: jest.fn(),
      uploadSuppressions: jest.fn(() => Promise.resolve()),
      history: { push: jest.fn() },
      showAlert: jest.fn()
    };
    wrapper = shallow(<UploadForm {...props} />);
    instance = wrapper.instance();
  });

  it('should render upload form', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should disable fields when submitting', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleSubmit tests', () => {
    it('displays an alert and redirects after successful upload', async() => {
      const args = {
        subaccount: 999,
        suppressionsFile: { name: 'example.csv' }
      };

      await instance.handleSubmit(args);

      expect(instance.props.uploadSuppressions).toHaveBeenCalledWith(args.suppressionsFile, args.subaccount);
      expect(instance.props.showAlert).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
      expect(instance.props.history.push).toHaveBeenCalled();
    });

    it('catches errors when uploading suppressions', async() => {
      wrapper.setProps({ uploadSuppressions: jest.fn(() => Promise.reject(new Error('Oh no!'))) });
      const args = {
        subaccount: 999,
        suppressionsFile: { name: 'example.csv' }
      };

      await instance.handleSubmit(args);
      expect(instance.props.showAlert).not.toHaveBeenCalled();
      expect(instance.props.history.push).not.toHaveBeenCalled();
    });
  });
});
