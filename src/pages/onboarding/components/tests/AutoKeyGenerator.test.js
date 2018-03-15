import { shallow } from 'enzyme';
import React from 'react';
import { AutoKeyGenerator } from '../AutoKeyGenerator';

const keyDefaults = {
  label: 'Send Email Key (auto-generated)',
  grants: ['smtp/inject', 'transmissions/modify', 'templates/view']
};

describe('AutoKeyGenerator', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      createApiKey: jest.fn(() => Promise.resolve()),
      hideNewApiKey: jest.fn(),
      history: {
        push: jest.fn()
      },
      render: jest.fn(() => 'Rendered Component'),
      apiKey: '123456789'
    };

    wrapper = shallow(<AutoKeyGenerator {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new key on mount', () => {
    expect(wrapper.instance().props.createApiKey).toHaveBeenCalledWith(keyDefaults);
  });

  it('should handle failure on new key creation', async() => {
    const createFailure = jest.fn(() => Promise.reject({ message: 'error' }));
    wrapper.setProps({ createApiKey: createFailure });
    await wrapper.instance().createKey();

    const props = wrapper.instance().props;
    expect(createFailure).toHaveBeenCalledWith(keyDefaults);
    expect(props.history.push).toHaveBeenCalledWith('/dashboard');
  });

  it('should render loading without an api key', () => {
    wrapper.setProps({ apiKey: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call render with api key and default email', () => {
    const props = wrapper.instance().props;
    expect(props.render).toHaveBeenCalledWith({ apiKey: props.apiKey, email: 'email address here' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should call render with api key and user email', () => {
    wrapper.setProps({ email: 'user@email.com' });
    const props = wrapper.instance().props;
    expect(props.render).toHaveBeenCalledWith({ apiKey: props.apiKey, email: 'user@email.com' });
  });

  it('should clear new key on unmount', () => {
    const props = wrapper.instance().props;
    wrapper.unmount();
    expect(props.hideNewApiKey).toHaveBeenCalled();
  });
});
