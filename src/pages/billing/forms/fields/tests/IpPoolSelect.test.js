import React from 'react';
import { IpPoolSelect } from '../IpPoolSelect';
import { shallow } from 'enzyme';

describe('IP Pool Selector:', () => {
  const props = {
    'disabled': false,
    'formName': 'add-sending-ips',
    'action': 'new',
    'ipPools': [
      {
        'id': 'default',
        'name': 'Default',
        'ips': [],
        'customer_provided': false
      },
      {
        'id': 'my_pool',
        'name': 'my pool',
        'ips': [
          {
            'external_ip': '192.168.0.1',
            'hostname': 'a.hostname.net'
          }
        ],
        'customer_provided': false
      },
      {
        'id': 'some_pool',
        'name': 'Some Pool',
        'ips': [
          {
            'external_ip': '192.168.0.2',
            'hostname': 'a.hostname.com'
          }
        ],
        'customer_provided': false
      }
    ],
    'loading': false,
    listPools: jest.fn()
  };

  it('should render', () => {
    const wrapper = shallow(<IpPoolSelect {...props} />);
    expect(wrapper).toMatchSnapshot();
    wrapper.instance().componentDidMount();
    expect(props.listPools).toHaveBeenCalled();
  });

  it('should render when disabled', () => {
    const wrapper = shallow(<IpPoolSelect {...props} />);
    wrapper.setProps({ disabled: true });
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should properly update when moving between new and existing IP', () => {
    const wrapper = shallow(<IpPoolSelect {...props} />);
    expect(wrapper.find('NewIpPoolField')).toHaveLength(1);
    expect(wrapper.find('ExistingIpPoolField')).toHaveLength(0);
    expect(wrapper).toMatchSnapshot();

    wrapper.setProps({ action: 'existing' });
    wrapper.update();
    expect(wrapper.find('NewIpPoolField')).toHaveLength(0);
    expect(wrapper.find('ExistingIpPoolField')).toHaveLength(1);
    expect(wrapper).toMatchSnapshot();

    wrapper.instance().componentDidMount();
    expect(props.listPools).toHaveBeenCalled();
  });

});
