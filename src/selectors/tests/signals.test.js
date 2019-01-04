import * as selectors from '../signals';
import * as dateHelpers from 'src/helpers/date';

jest.mock('src/helpers/date');

describe('Selectors: signals', () => {
  const state = {
    signals: {
      spamHits: {
        total_count: 1,
        data: [
          {
            sending_domain: 'test.com',
            current_trap_hits: 123,
            current_relative_trap_hits: 0.12,
            history: [
              {
                dt: '2018-01-01',
                injections: 182400,
                relative_trap_hits: 0.25,
                trap_hits: 456
              },
              {
                dt: '2018-01-02',
                injections: 35000,
                relative_trap_hits: 0.1,
                trap_hits: 35
              }
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
      const stateWhenEmpty = { signals: { spamHits: { data: [], loading: false }}};
      expect(selectors.selectSpamHitsDetails(stateWhenEmpty, props)).toMatchSnapshot();
    });

    it('should not be empty when loading', () => {
      const stateWhenLoading = { signals: { spamHits: { data: [], loading: true }}};
      expect(selectors.selectSpamHitsDetails(stateWhenLoading, props).details.empty).toBe(false);
    });
  });

  describe('selected date', () => {
    it('should select date from react router', () => {
      expect(selectors.getSelectedDateFromRouter(state, props)).toMatchSnapshot();
    });
  });


  describe('selectSpamHitsOverviewData', () => {
    beforeEach(() => {
      dateHelpers.fillByDate.mockImplementationOnce(({ dataSet }) => dataSet);
    });

    it('returns data', () => {
      expect(selectors.selectSpamHitsOverviewData(state, { relativeRange: '7days' })).toMatchSnapshot();
    });

    it('returns empty array', () => {
      const stateWhenEmpty = { signals: { spamHits: { data: []}}};
      expect(selectors.selectSpamHitsOverviewData(stateWhenEmpty, { relativeRange: '7days' })).toEqual([]);
    });
  });

  describe('selectSpamHitsOverviewMetaData', () => {
    it('returns max values', () => {
      expect(selectors.selectSpamHitsOverviewMetaData(state)).toEqual({
        currentMax: 123,
        currentRelativeMax: 0.12,
        max: 456,
        relativeMax: 0.25
      });
    });

    it('returns null', () => {
      const stateWhenEmpty = { signals: { spamHits: { data: []}}};
      expect(selectors.selectSpamHitsOverviewMetaData(stateWhenEmpty)).toEqual({
        currentMax: null,
        currentRelativeMax: null,
        max: null,
        relativeMax: null
      });
    });
  });
});
