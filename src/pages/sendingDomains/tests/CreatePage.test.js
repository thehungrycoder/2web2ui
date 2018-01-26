import { shallow } from 'enzyme';
import React from 'react';
import { CreatePage } from '../CreatePage';

describe('Sending Domains Create Page', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      showAlert: jest.fn(),
      createDomain: jest.fn(() => Promise.resolve()),
      history: { push: jest.fn() }
    };
    wrapper = shallow(<CreatePage {...props}/>);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders and mounts correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('on success - calls the create action and redirects', async() => {
    await wrapper.instance().handleCreate({ domain: 'domain.com' });
    expect(wrapper.instance().props.createDomain).toHaveBeenCalledWith({ domain: 'domain.com' });
    expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/account/sending-domains/edit/domain.com');
  });

  it('on error - shows and error', async() => {
    wrapper.setProps({ createDomain: jest.fn(() => Promise.reject({ message: 'error' })) });
    await wrapper.instance().handleCreate({ domain: 'domain.com' });
    expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({ details: 'error', message: 'Could not add domain', type: 'error' });
    expect(wrapper.instance().props.history.push).not.toHaveBeenCalled();
  });
});
