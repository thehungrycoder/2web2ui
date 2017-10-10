import React from 'react';
import { shallow } from 'enzyme';

import { ListPage } from '../ListPage';

const props = {
  loading: false,
  error: null,
  hasSubaccounts: false,
  trackingDomains: [
    {
      default: false,
      domain: 'all.verified.com',
      status: {
        verified: true,
        cname_status: 'valid',
        compliance_status: 'valid'
      }
    },
    {
     default: false,
     domain: 'all.unverified.com',
     status: {
       verified: false,
       cname_status: 'unverified',
       compliance_status: 'unverified'
     }
    },
    {
      default: true,
      domain: 'the.default.com',
      status: {
        verified: true,
        cname_status: 'valid',
        compliance_status: 'valid'
      }
    }
  ]
};

let wrapper;

beforeEach(() => {
  wrapper = shallow(<ListPage {...props} />);
});

it('renders correctly', () => {
  expect(wrapper).toMatchSnapshot();
});

it('renders empty state', () => {
  wrapper = shallow(<ListPage loading={false} error={null} trackingDomains={[]} />);
  expect(wrapper).toMatchSnapshot();
});

it('renders errors when present', () => {
  wrapper.setProps({
    error: {
      payload: {
        message: 'Uh oh! It broke.'
      },
      meta: {
        method: 'GET'
      }
    }});
  expect(wrapper).toMatchSnapshot();
});
