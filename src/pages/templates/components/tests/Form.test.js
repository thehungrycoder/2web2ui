import { shallow } from 'enzyme';
import React from 'react';

import { Form } from '../Form';

describe('Template Form', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      domains: [
        { domain: 'test.com' },
        { domain: 'verified.com' }
      ],
      listDomains: jest.fn(),
      change: jest.fn(),
      newTemplate: false,
      published: false,
      name: 'form-name'
    };

    wrapper = shallow(<Form {...props} />);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.listDomains).toHaveBeenCalled();
  });

  it('should disable fields on published', () => {
    wrapper.setProps({ published: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should use sandbox domain if account has no verified domains', () => {
    wrapper.setProps({ newTemplate: true });
    wrapper.setProps({ domains: []});
    expect(wrapper.instance().props.change).toHaveBeenCalledWith(wrapper.instance().props.name, 'content.from.email', 'sandbox@sparkpostbox.com');
  });

  it('should not handle ID fill on edit', () => {
    wrapper.find('Field').at(0).simulate('change', { target: { value: 'test 1 2!' }});
    expect(wrapper.instance().props.change).not.toHaveBeenCalled();
  });

  it('should handle ID fill', () => {
    wrapper.setProps({ newTemplate: true });
    wrapper.find('Field').at(0).simulate('change', { target: { value: 'test 1 2!' }});
    expect(wrapper.instance().props.change).toHaveBeenCalledWith(wrapper.instance().props.name, 'id', 'test-1-2');
  });

  it('should validate verified domain', () => {
    wrapper.setProps({ domains: [{ domain: 'valid.com' }]});
    const result = wrapper.instance().verifiedDomain('email@valid.com');
    expect(result).toEqual(undefined);
  });

  it('should validate sandbox domain', () => {
    const result = wrapper.instance().verifiedDomain('sandbox@sparkpostbox.com');
    expect(result).toEqual(undefined);
  });

  it('should validate unverified domain', () => {
    wrapper.setProps({ domains: [{ domain: 'valid.com' }]});
    const result = wrapper.instance().verifiedDomain('email@notvalid.com');
    expect(result).toEqual('Must use a verified sending domain');
  });
});
