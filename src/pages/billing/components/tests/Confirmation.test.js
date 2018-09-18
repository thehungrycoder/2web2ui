import React from 'react';
import Confirmation from '../Confirmation';
import { shallow } from 'enzyme';

describe('Confirmation: ', () => {
  let wrapper;
  let props;
  const current = {
    monthly: 100,
    volume: 1000,
    code: 'onehundred',
    includesIp: true
  };

  const upgrade = {
    monthly: 200,
    volume: 2000,
    code: 'twohundred'
  };

  const upgradeWithIP = {
    monthly: 200,
    volume: 2000,
    code: 'twohundred',
    includesIp: true
  };

  const downgrade = {
    monthly: 50,
    volume: 500,
    code: 'fifty',
    includesIp: false
  };

  const free = {
    monthly: 0,
    volume: 100,
    code: 'zero',
    isFree: true
  };

  beforeEach(() => {
    props = {
      current,
      selected: current,
      billingEnabled: true
    };

    wrapper = shallow(<Confirmation {...props} />);
  });

  it('should render with nothing selected', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with an upgrade', () => {
    wrapper.setProps({ selected: upgrade, billingEnabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly for an upgrade effectively immediately', () => {
    wrapper.setProps({ current: free, selected: upgrade, billingEnabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with a downgrade', () => {
    wrapper.setProps({ selected: downgrade, billingEnabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with a downgrade to free', () => {
    wrapper.setProps({ selected: free, billingEnabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with an upgrade with IP', () => {
    wrapper.setProps({ current: free, selected: upgradeWithIP, billingEnabled: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when billing not enabled', () => {
    wrapper.setProps({ billingEnabled: false });
    expect(wrapper).toMatchSnapshot();
  });
});
