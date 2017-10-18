import cases from 'jest-in-case';
import { getRowData, getRowDataWithSubaccount } from '../getRowData';
import _fp from 'lodash/fp';

const baseCases = {
  'all verified': {
    trackingDomain: {
      default: false,
      domain: 'all.verified.com',
      status: {
        verified: true,
        cname_status: 'valid',
        compliance_status: 'valid'
      }
    }
  },
  'all unverified': {
    trackingDomain: {
      default: false,
      domain: 'all.unverified.com',
      status: {
        verified: false,
        cname_status: 'unverified',
        compliance_status: 'unverified'
      }
    }
  },
  default: {
    trackingDomain: {
      default: true,
      domain: 'the.default.com',
      status: {
        verified: true,
        cname_status: 'valid',
        compliance_status: 'valid'
      }
    }
  },
  'cname unverified': {
    trackingDomain: {
      default: false,
      domain: 'cname.unverified.com',
      status: {
        verified: false,
        cname_status: 'unverified',
        compliance_status: 'valid'
      }
    }
  },
  'cname pending': {
    trackingDomain: {
      default: false,
      domain: 'cname.pending.com',
      status: {
        verified: false,
        cname_status: 'pending',
        compliance_status: 'valid'
      }
    }
  },
  'cname invalid': {
    trackingDomain: {
      default: false,
      domain: 'cname.invalid.com',
      status: {
        verified: false,
        cname_status: 'invalid',
        compliance_status: 'valid'
      }
    }
  },
  'compliance unverified': {
    trackingDomain: {
      default: false,
      domain: 'compliance.unverified.com',
      status: {
        verified: true,
        cname_status: 'valid',
        compliance_status: 'unverified'
      }
    }
  },
  'compliance pending': {
    trackingDomain: {
      default: false,
      domain: 'compliance.pending.com',
      status: {
        verified: true,
        cname_status: 'valid',
        compliance_status: 'pending'
      }
    }
  },
  'compliance blocked': {
    trackingDomain: {
      default: false,
      domain: 'cname.invalid.com',
      status: {
        verified: true,
        cname_status: 'valid',
        compliance_status: 'blocked'
      }
    }
  }
};

const subaccountCases = _fp.cloneDeep(baseCases);

subaccountCases['sub default'] = {
  trackingDomain: {
    default: true,
    domain: 'the.default.com',
    subaccount_id: 125,
    status: {
      verified: true,
      cname_status: 'valid',
      compliance_status: 'valid'
    }
  }
};

subaccountCases['sub unverified'] = {
  trackingDomain: {
    default: false,
    domain: 'all.unverified.com',
    subaccount_id: 145,
    status: {
      verified: false,
      cname_status: 'unverified',
      compliance_status: 'unverified'
    }
  }
};

cases('getRowData', (opts) => {
  const rowData = getRowData(opts.trackingDomain);
  expect(rowData).toMatchSnapshot();
}, baseCases);

cases('getRowDataWithSubaccount', (opts) => {
  const rowData = getRowDataWithSubaccount(opts.trackingDomain);
  expect(rowData).toMatchSnapshot();
}, subaccountCases);
