import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import { getSpamHits } from '../signals';

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
    'with a filter': {
      action: () => getSpamHits({ ...requiredOptions, filter: 'examp' })
    },
    'with a subaccount': {
      action: () => getSpamHits({ ...requiredOptions, subaccount: { id: 123 }})
    }
  });
});
