import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';

import TrackingDomainsCollection from '../TrackingDomainsCollection';

const domainRows = [
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
  }
];

cases('TrackingDomainsCollection', ({ rows, hasSubaccounts }) => {
  const wrapper = shallow(<TrackingDomainsCollection rows={rows} hasSubaccounts={hasSubaccounts} />);
  expect(wrapper).toMatchSnapshot();
}, {
  'no subaccounts': { hasSubaccounts: false, rows: domainRows },
  'subaccounts': { hasSubaccounts: true, rows: domainRows }
});
