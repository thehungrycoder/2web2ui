import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import { getSpamHits, getSpamHitsDetails } from '../signals';

jest.mock('src/actions/helpers/sparkpostApiRequest');
jest.mock('src/helpers/date', () => ({
  formatInputDate: (d) => d,
  getRelativeDates: () => ({
    from: '2018-01-12',
    to: '2018-01-13'
  })
}));

describe('Signals Actions', () => {
  const signalOptions = {
    relativeRange: '14days'
  };

  snapshotActionCases('.getSpamHits', {
    'by default': {
      action: getSpamHits,
      state: { signalOptions }
    },
    'with a facet': {
      action: getSpamHits,
      state: {
        signalOptions: {
          ...signalOptions,
          facet: 'sending-domain'
        }
      }
    },
    'with a search term': {
      action: getSpamHits,
      state: {
        signalOptions: {
          ...signalOptions,
          facetSearchTerm: 'examp'
        }
      }
    },
    'with a subaccount': {
      action: getSpamHits,
      state: {
        signalOptions: {
          ...signalOptions,
          subaccount: { id: 123 }
        }
      }
    }
  });

  snapshotActionCases('.getSpamHitsDetails', {
    'with facetId': {
      action: () => getSpamHitsDetails({ facetId: 'example.com' }),
      state: { signalOptions }
    }
  });
});
