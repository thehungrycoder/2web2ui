import * as selectors from '../signals';

describe('Selectors: signals', () => {
  let state = {
    signals: {
      spamHits: {
        total_count: 10,
        data: [
          {
            sending_domain: 'test.com',
            current_trap_hits: 123,
            current_relative_trap_hits: 0.12,
            history: [
              { trap_hits: 456, relative_trap_hits: 0.25, dt: '2018-01-01' }
            ]
          }
        ],
        loading: false,
        error: null
      }
    }
  };

  const props = {
    match: {
      params: {
        facet: 'sending_domain',
        facetId: 'test.com'
      }
    },
    location: {
      state: {
        date: '2018-02-01'
      },
      search: '?subaccount=101'
    }
  };

  describe('spam hits details', () => {
    it('should select spam hits details', () => {
      expect(selectors.selectSpamHitsDetails(state, props)).toMatchSnapshot();
    });

    it('should be empty with no results when not loading', () => {
      state = { signals: { spamHits: { data: [], loading: false }}};
      expect(selectors.selectSpamHitsDetails(state, props)).toMatchSnapshot();
    });

    it('should not be empty when loading', () => {
      state = { signals: { spamHits: { data: [], loading: true }}};
      expect(selectors.selectSpamHitsDetails(state, props).details.empty).toBe(false);
    });
  });

  describe('selected date', () => {
    it('should select date from react router', () => {
      expect(selectors.getSelectedDateFromRouter(state, props)).toMatchSnapshot();
    });
  });
});
