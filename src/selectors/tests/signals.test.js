import moment from 'moment';
import * as selectors from '../signals';

describe('Selectors: signals', () => {
  let state;
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
    },
    now: moment('2018-01-03')
  };

  beforeEach(() => {
    state = {
      signalOptions: {
        relativeRange: '7days'
      },
      signals: {
        spamHits: {
          total_count: 1,
          data: [
            {
              sending_domain: 'test.com',
              current_trap_hits: 35,
              current_relative_trap_hits: 0.001,
              history: [
                {
                  dt: '2018-01-01',
                  injections: 182400,
                  relative_trap_hits: 0.0025, // bad
                  trap_hits: 456
                },
                {
                  dt: '2018-01-03',
                  injections: 35000,
                  relative_trap_hits: 0.001, // good
                  trap_hits: 35
                }
              ]
            },
            {
              sending_domain: 'null.test.com',
              current_trap_hits: null,
              current_relative_trap_hits: null,
              history: [
                {
                  dt: '2018-01-01',
                  injections: 282400,
                  relative_trap_hits: 0.003, // bad
                  trap_hits: 856
                },
                {
                  dt: '2018-01-02',
                  injections: 50000,
                  relative_trap_hits: 0.001, // good
                  trap_hits: 50
                }
              ]
            }
          ],
          loading: false,
          error: null
        },
        engagementRecency: {
          total_count: 10,
          data: [
            {
              sending_domain: 'test.com',
              current_c_14d: 10,
              current_c_total: 50,
              history: [
                {
                  c_total: 25,
                  c_new: 5,
                  c_uneng: 5,
                  c_14d: 5,
                  c_365d: 5,
                  dt: '2018-01-01'
                },
                {
                  c_total: 50,
                  c_new: 10,
                  c_uneng: 10,
                  c_14d: 10,
                  c_365d: 10,
                  dt: '2018-01-03'
                }
              ]
            }
          ],
          loading: false,
          error: null
        },
        healthScore: {
          total_count: 10,
          data: [
            {
              current_weights: [],
              current_health_score: 0.98,
              sending_domain: 'test.com',
              history: [
                {
                  dt: '2018-01-01',
                  health_score: 0.74321, // bad
                  weights: [
                    {
                      weight_type: 'eng cohorts: new, 14-day',
                      weight: 0.5,
                      weight_value: 0.5
                    },
                    {
                      weight_type: 'Transient Failures',
                      weight: 0.7,
                      weight_value: 0.5
                    },
                    {
                      weight_type: 'Other bounces',
                      weight: -0.1,
                      weight_value: 0.5
                    }
                  ]
                },
                {
                  dt: '2018-01-03',
                  health_score: 0.98, // good
                  weights: []
                }
              ]
            }
          ]
        }
      }
    };
  });

  describe('spam hits details', () => {
    it('should select spam hits details', () => {
      expect(selectors.selectSpamHitsDetails(state, props)).toMatchSnapshot();
    });

    it('should be empty with only fill data when not loading', () => {
      const stateWhenEmpty = { ...state, signals: { spamHits: { data: [], loading: false }}};
      expect(selectors.selectSpamHitsDetails(stateWhenEmpty, props)).toMatchSnapshot();
    });

    it('should not be empty when loading', () => {
      const stateWhenLoading = { ...state, signals: { spamHits: { data: [], loading: true }}};
      expect(selectors.selectSpamHitsDetails(stateWhenLoading, props).details.empty).toBe(false);
    });
  });

  describe('engagement recency details', () => {
    it('should select details', () => {
      expect(selectors.selectEngagementRecencyDetails(state, props)).toMatchSnapshot();
    });

    it('should be empty with only fill data when not loading', () => {
      const stateWhenEmpty = { ...state, signals: { engagementRecency: { data: [], loading: false }}};
      expect(selectors.selectEngagementRecencyDetails(stateWhenEmpty, props)).toMatchSnapshot();
    });

    it('should not be empty when loading', () => {
      const stateWhenLoading = { ...state, signals: { engagementRecency: { data: [], loading: true }}};
      expect(selectors.selectEngagementRecencyDetails(stateWhenLoading, props).details.empty).toBe(false);
    });
  });

  describe('health score details', () => {
    it('should select details', () => {
      expect(selectors.selectHealthScoreDetails(state, props)).toMatchSnapshot();
    });

    it('should be empty with only fill data when not loading', () => {
      const stateWhenEmpty = { ...state, signals: { healthScore: { data: [], loading: false }, spamHits: { data: []}}};
      expect(selectors.selectHealthScoreDetails(stateWhenEmpty, props)).toMatchSnapshot();
    });

    it('should not be empty when loading', () => {
      const stateWhenLoading = { ...state, signals: { healthScore: { data: [], loading: true }, spamHits: { data: []}}};
      expect(selectors.selectHealthScoreDetails(stateWhenLoading, props).details.empty).toBe(false);
    });
  });

  describe('selected date', () => {
    it('should select date from react router', () => {
      expect(selectors.getSelectedDateFromRouter(state, props)).toMatchSnapshot();
    });
  });

  describe('selectEngagementRecencyOverviewData', () => {
    it('returns data', () => {
      expect(selectors.selectEngagementRecencyOverviewData(state, props)).toMatchSnapshot();
    });

    it('returns empty array', () => {
      const stateWhenEmpty = { ...state, signals: { engagementRecency: { data: []}}};
      expect(selectors.selectEngagementRecencyOverviewData(stateWhenEmpty, props)).toEqual([]);
    });
  });

  describe('selectEngagementRecencyOverviewMetaData', () => {
    it('returns max values', () => {
      expect(selectors.selectEngagementRecencyOverviewMetaData(state, props)).toEqual({
        currentMax: 10,
        currentRelativeMax: 20,
        max: 10,
        relativeMax: 20
      });
    });

    it('returns null', () => {
      const stateWhenEmpty = { signals: { engagementRecency: { data: []}}};
      expect(selectors.selectEngagementRecencyOverviewMetaData(stateWhenEmpty, props)).toEqual({
        currentMax: null,
        currentRelativeMax: null,
        max: null,
        relativeMax: null
      });
    });
  });

  describe('selectEngagementRecencyOverview', () => {
    it('returns all overview data', () => {
      expect(selectors.selectEngagementRecencyOverview(state, props)).toMatchSnapshot();
    });
  });

  describe('selectSpamHitsOverviewData', () => {
    it('returns data', () => {
      expect(selectors.selectSpamHitsOverviewData(state, props)).toMatchSnapshot();
    });

    it('returns empty array', () => {
      const stateWhenEmpty = { ...state, signals: { spamHits: { data: []}}};
      expect(selectors.selectSpamHitsOverviewData(stateWhenEmpty, props)).toEqual([]);
    });
  });

  describe('selectSpamHitsOverviewMetaData', () => {
    it('returns max values', () => {
      expect(selectors.selectSpamHitsOverviewMetaData(state, props)).toEqual({
        currentMax: 35,
        currentRelativeMax: 0.1,
        max: 856,
        relativeMax: 0.3
      });
    });

    it('returns null', () => {
      const stateWhenEmpty = { ...state, signals: { spamHits: { data: []}}};
      expect(selectors.selectSpamHitsOverviewMetaData(stateWhenEmpty, props)).toEqual({
        currentMax: null,
        currentRelativeMax: null,
        max: null,
        relativeMax: null
      });
    });
  });

  describe('selectSpamHitsOverview', () => {
    it('returns all overview data', () => {
      expect(selectors.selectSpamHitsOverview(state, props)).toMatchSnapshot();
    });
  });

  describe('selectHealthScoreOverviewData', () => {
    it('returns data', () => {
      expect(selectors.selectHealthScoreOverviewData(state, props)).toMatchSnapshot();
    });

    it('returns empty array', () => {
      const stateWhenEmpty = { ...state, signals: { healthScore: { data: []}}};
      expect(selectors.selectHealthScoreOverviewData(stateWhenEmpty, props)).toEqual([]);
    });
  });

  describe('selectHealthScoreOverview', () => {
    it('returns all overview data', () => {
      expect(selectors.selectHealthScoreOverview(state, props)).toMatchSnapshot();
    });
  });
});
