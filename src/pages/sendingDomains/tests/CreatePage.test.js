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
});
