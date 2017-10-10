import React from 'react';
import Confirmation from '../Confirmation';
import { shallow } from 'enzyme';

describe('Confirmation: ', () => {
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

  it('should render with nothing selected', () => {
    const props = { current, selected: current, selfServe: true };
    const wrapper = shallow(<Confirmation {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with an upgrade', () => {
    const props = { current, selected: upgrade, selfServe: true };
    const wrapper = shallow(<Confirmation {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with a downgrade', () => {
    const props = { current, selected: downgrade, selfServe: true };
    const wrapper = shallow(<Confirmation {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with a downgrade to free', () => {
    const props = { current, selected: free, selfServe: true };
    const wrapper = shallow(<Confirmation {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
