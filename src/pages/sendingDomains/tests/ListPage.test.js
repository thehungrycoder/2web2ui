import { shallow } from 'enzyme';
import React from 'react';

import { ListPage } from '../ListPage';

describe('Sending Domains List Page', () => {
  let wrapper;

  const domains = [
    {
      domain: 'test.com',
      status: {
        ownership_verified: true,
        compliance_status: 'valid',
        cname_status: 'valid',
        dkim_status: 'valid',
        mx_status: 'valid'
      },
      is_default_bounce_domain: true,
      subaccount_id: 3
    },
    {
      domain: 'test2.com',
      status: {
        ownership_verified: false,
        compliance_status: 'valid',
        cname_status: 'valid',
        dkim_status: 'valid',
        mx_status: 'valid'
      }
    }
  ];

  beforeEach(() => {
    const props = {
      domains,
      listError: null,
      hasSubaccounts: false,
      hasUnverifiedDomains: false,
      listLoading: false,
      listDomains: jest.fn()
    };

    wrapper = shallow(<ListPage {...props}/>);
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().props.listDomains).toHaveBeenCalledTimes(1);
  });

  it('renders loading correctly', () => {
    wrapper.setProps({ listLoading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders error banner correctly', () => {
    wrapper.setProps({ listError: { message: 'error' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('renders warning banner with unverified sending domains', () => {
    wrapper.setProps({ hasUnverifiedDomains: true });
    expect(wrapper.find('UnverifiedWarningBanner')).toHaveLength(1);
  });

  it('renders correct columns with subaccounts', () => {
    wrapper.setProps({ hasSubaccounts: true });
    const result = wrapper.instance().getColumns();
    expect(result).toMatchSnapshot();
  });

  it('renders rows correctly with no subaccounts', () => {
    const result = domains.map(wrapper.instance().getRowData);
    expect(result).toMatchSnapshot();
  });

  it('renders rows correctly', () => {
    wrapper.setProps({ hasSubaccounts: true });
    const result = domains.map(wrapper.instance().getRowData);
    expect(result).toMatchSnapshot();
  });
});
