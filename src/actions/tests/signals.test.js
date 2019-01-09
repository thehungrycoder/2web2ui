import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import { getSpamHits, getEngagementRecency, getHealthScore } from '../signals';

jest.mock('src/actions/helpers/sparkpostApiRequest');
jest.mock('src/helpers/date', () => ({
  formatInputDate: (d) => d,
  getRelativeDates: () => ({
    from: '2018-01-12',
    to: '2018-01-13'
  })
}));

describe('Signals Actions', () => {
  const requiredOptions = {
    relativeRange: '14days'
  };

  snapshotActionCases('.getSpamHits', {
    'by default': {
      action: () => getSpamHits({ ...requiredOptions })
    },
    'with a facet': {
      action: () => getSpamHits({ ...requiredOptions, facet: 'sending-domain' })
    },
    'with a subaccount facet': {
      action: () => getSpamHits({ ...requiredOptions, facet: 'sid', filter: 123 })
    },
    'with a filter': {
      action: () => getSpamHits({ ...requiredOptions, filter: 'examp' })
    },
    'with a limit': {
      action: () => getSpamHits({ ...requiredOptions, limit: 100 })
    },
    'with a offset': {
      action: () => getSpamHits({ ...requiredOptions, offset: 9 })
    },
    'with an order': {
      action: () => getSpamHits({ ...requiredOptions, order: 'asc', orderBy: 'example_field' })
    },
    'with a order field that needs to be mapped': {
      action: () => getSpamHits({ ...requiredOptions, order: 'asc', orderBy: 'current_trap_hits' })
    },
    'with a subaccount': {
      action: () => getSpamHits({ ...requiredOptions, subaccount: { id: 123 }})
    }
  });

  snapshotActionCases('.getEngagementRecency', {
    'by default': {
      action: () => getEngagementRecency({ ...requiredOptions })
    }
  });

  snapshotActionCases('.getHealthScore', {
    'by default': {
      action: () => getHealthScore({ ...requiredOptions })
    }
  });
});
