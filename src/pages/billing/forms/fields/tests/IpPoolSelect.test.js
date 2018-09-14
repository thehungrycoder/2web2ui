import React from 'react';
import { IpPoolSelect } from '../IpPoolSelect';
import { shallow } from 'enzyme';

describe('IP Pool Selector:', () => {
  let wrapper;

  const props = {
    error: null,
    history: {},
    ipPools: [
      {
        customer_provided: false,
        id: 'default',
        ips: [],
        name: 'Default'
      },
      {
        customer_provided: false,
        id: 'pool_1',
        ips: [],
        name: 'pool_1'
      }
    ],
    listPools: jest.fn(),
    loading: false,
    showPurchaseCTA: true
  };

  beforeEach(() => {
    wrapper = shallow(<IpPoolSelect {...props} />);
  });

  it('should render', () => {
    const component = wrapper.instance();
    const stateSpy = jest.spyOn(component, 'setState');
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().componentDidMount();
    expect(stateSpy).not.toHaveBeenCalled();
    expect(component.props.listPools).toHaveBeenCalled();
  });
});
