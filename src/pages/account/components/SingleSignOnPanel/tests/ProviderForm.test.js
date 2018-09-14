import React from 'react';
import { shallow } from 'enzyme';
import { ProviderForm } from '../ProviderForm';
import { getBase64Contents } from 'src/helpers/file';

jest.mock('src/helpers/file');

describe('ProviderForm', () => {
  const subject = (props = {}) => (
    shallow(<ProviderForm {...props} handleSubmit={(handler) => handler} />)
  );

  it('renders form', () => {
    const wrapper = subject();
    expect(wrapper).toMatchSnapshot();
  });

  it('disables fields and buttons when submitting', () => {
    const wrapper = subject({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = jest.fn();
    const wrapper = subject({ onCancel });

    wrapper.find('Button.cancel').simulate('click');
    expect(onCancel).toHaveBeenCalled();
  });

  it('calls onSubmit when updated', () => {
    const onSubmit = jest.fn();
    const wrapper = subject({ onSubmit });

    wrapper.setProps({ updatedAt: '2018-09-11T21:17:50+00:00' });

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('provisions on submit', async () => {
    const provisionAccountSingleSignOn = jest.fn(() => Promise.resolve());
    const showAlert = jest.fn();
    const wrapper = subject({ provisionAccountSingleSignOn, showAlert });

    getBase64Contents.mockImplementationOnce(() => Promise.resolve('abc=='));
    await wrapper.instance().submit({ samlFile: 'sample.xml' });

    expect(getBase64Contents).toHaveBeenCalledWith('sample.xml');
    expect(provisionAccountSingleSignOn).toHaveBeenCalledWith('abc==');
    expect(showAlert).toHaveBeenCalled();
  });

  it('reprovisions on submit when provider is present', async () => {
    const reprovisionAccountSingleSignOn = jest.fn(() => Promise.resolve());
    const showAlert = jest.fn();
    const wrapper = subject({
      provider: 'https://sso.sparkpost.com/redirect',
      reprovisionAccountSingleSignOn,
      showAlert
    });

    getBase64Contents.mockImplementationOnce(() => Promise.resolve('abc=='));
    await wrapper.instance().submit({ samlFile: 'sample.xml' });

    expect(getBase64Contents).toHaveBeenCalledWith('sample.xml');
    expect(reprovisionAccountSingleSignOn).toHaveBeenCalledWith('abc==');
    expect(showAlert).toHaveBeenCalled();
  });
});
