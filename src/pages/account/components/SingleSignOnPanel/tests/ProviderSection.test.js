import React from 'react';
import { shallow } from 'enzyme';
import ProviderForm from '../ProviderForm';
import { ProviderSection } from '../ProviderSection';

describe('ProviderSection', () => {
  const subject = (props = {}) => shallow(<ProviderSection {...props} />);

  it('renders when not provisioned', () => {
    const wrapper = subject();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders when provisioned', () => {
    const wrapper = subject({
      provider: 'https://sso.sparkpost.com/redirect'
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('opens modal when action button is clicked', () => {
    const wrapper = subject();
    wrapper.prop('actions')[0].onClick();

    expect(wrapper.state('isModalOpen')).toEqual(true);
  });

  it('closes modal when provider form is cancelled', () => {
    const wrapper = subject();

    wrapper.setState({ isModalOpen: true });
    wrapper.find(ProviderForm).simulate('cancel');

    expect(wrapper.state('isModalOpen')).toEqual(false);
  });

  it('closes modal when provider form is submitted', () => {
    const wrapper = subject();

    wrapper.setState({ isModalOpen: true });
    wrapper.find(ProviderForm).simulate('submit');

    expect(wrapper.state('isModalOpen')).toEqual(false);
  });
});
