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
      selfServe: true,
      billingEnabled: true
    };
    wrapper = shallow(<Confirmation {...props} />);
  });

  it('should render with nothing selected', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with an upgrade', () => {
    wrapper.setProps({ selected: upgrade, selfServe: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with a downgrade', () => {
    wrapper.setProps({ selected: downgrade, selfServe: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with a downgrade to free', () => {
    wrapper.setProps({ selected: free, selfServe: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when billing not enabled', () => {
    wrapper.setProps({ billingEnabled: false });
    expect(wrapper).toMatchSnapshot();
  });
});
