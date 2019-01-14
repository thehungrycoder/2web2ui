/* eslint-disable max-lines */
import { createSelector } from 'reselect';
import { fillByDate } from 'src/helpers/date';
import { roundToPlaces } from 'src/helpers/units';
import { selectSubaccountIdFromQuery } from 'src/selectors/subaccounts';
import _ from 'lodash';
import moment from 'moment';

// Router props
export const getFacetFromParams = (state, props) => _.get(props, 'match.params.facet');
export const getFacetIdFromParams = (state, props) => _.get(props, 'match.params.facetId');
export const getSelectedDateFromRouter = (state, props) => _.get(props, 'location.state.date');
export const getOptions = (state, { now = moment().subtract(1, 'day'), ...options } = {}) => ({
  ...state.signalOptions,
  now,
  ...options
});

// Redux store
export const getSpamHitsData = (state, props) => _.get(state, 'signals.spamHits', {});
export const getEngagementRecencyData = (state, props) => _.get(state, 'signals.engagementRecency', {});
export const getHealthScoreData = (state, props) => _.get(state, 'signals.healthScore', {});

// Details
export const selectSpamHitsDetails = createSelector(
  [getSpamHitsData, getFacetFromParams, getFacetIdFromParams, selectSubaccountIdFromQuery, getOptions],
  ({ loading, error, data }, facet, facetId, subaccountId, { now, relativeRange }) => {
    const match = data.find((item) => String(item[facet]) === facetId) || {};
    const history = match.history || [];
    const normalizedHistory = history.map(({ dt: date, ...values }) => ({ date, ...values }));

    const filledHistory = fillByDate({
      dataSet: normalizedHistory,
      fill: {
        injections: null,
        relative_trap_hits: null,
        trap_hits: null
      },
      now,
      relativeRange
    });

    const isEmpty = filledHistory.every((values) => values.trap_hits === null);

    return {
      details: {
        data: filledHistory,
        empty: isEmpty && !loading,
        error,
        loading
      },
      facet,
      facetId,
      subaccountId
    };
  }
);

export const selectEngagementRecencyDetails = createSelector(
  [getEngagementRecencyData, getFacetFromParams, getFacetIdFromParams, selectSubaccountIdFromQuery, getOptions],
  ({ loading, error, data }, facet, facetId, subaccountId, { now, relativeRange }) => {
    const match = data.find((item) => String(item[facet]) === facetId) || {};

    const calculatePercentages = (data) => data.map(({ c_total, dt, ...absolutes }) => {
      let values = {};

      for (const key in absolutes) {
        values = { ...values, [key]: absolutes[key] / c_total };
      }

      return { ...values, c_total, dt };
    });

    const history = calculatePercentages(match.history || []);
    const normalizedHistory = history.map(({ dt: date, ...values }) => ({ date, ...values }));

    const filledHistory = fillByDate({
      dataSet: normalizedHistory,
      fill: {
        c_new: null,
        c_14d: null,
        c_90d: null,
        c_365d: null,
        c_uneng: null,
        c_total: null
      },
      now,
      relativeRange
    });

    const isEmpty = filledHistory.every((values) => values.c_total === null);

    return {
      details: {
        data: filledHistory,
        empty: isEmpty && !loading,
        error,
        loading
      },
      facet,
      facetId,
      subaccountId
    };
  }
);

export const selectHealthScoreDetails = createSelector(
  [getHealthScoreData, selectSpamHitsDetails, getFacetFromParams, getFacetIdFromParams, selectSubaccountIdFromQuery, getOptions],
  ({ loading, error, data }, { details: spamDetails }, facet, facetId, subaccountId, { now, relativeRange }) => {
    const match = data.find((item) => String(item[facet]) === facetId) || {};

    const history = _.get(match, 'history', []);
    const normalizedHistory = history.map(({ dt: date, weights, ...values }) => ({
      date,
      weights: _.sortBy(weights, ({ weight }) => parseFloat(weight)),
      ...values
    }));

    const filledHistory = fillByDate({
      dataSet: normalizedHistory,
      fill: {
        weights: [
          { weight_type: 'Hard Bounces', weight: null, weight_value: null },
          { weight_type: 'Complaints', weight: null, weight_value: null },
          { weight_type: 'Other bounces', weight: null, weight_value: null },
          { weight_type: 'Transient Failures', weight: null, weight_value: null },
          { weight_type: 'Block Bounces', weight: null, weight_value: null },
          { weight_type: 'List Quality', weight: null, weight_value: null },
          { weight_type: 'eng cohorts: new, 14-day', weight: null, weight_value: null },
          { weight_type: 'eng cohorts: unengaged', weight: null, weight_value: null }
        ],
        health_score: null
      },
      now,
      relativeRange
    });

    // Merge in injections
    const mergedHistory = _.map(filledHistory, (healthData) => {
      const spamData = _.find(spamDetails.data, ['date', healthData.date]);
      return { injections: spamData.injections, ...healthData };
    });

    const isEmpty = mergedHistory.every((values) => values.health_score === null);

    return {
      details: {
        data: mergedHistory,
        empty: isEmpty && !loading && !spamDetails.loading,
        error,
        loading: loading || spamDetails.loading
      },
      facet,
      facetId,
      subaccountId
    };
  }
);

export const selectEngagementRecencyOverviewData = createSelector(
  getEngagementRecencyData, getOptions,
  ({ data }, { now, relativeRange }) => data.map((rowOfData) => {
    const history = rowOfData.history || [];
    const normalizedHistory = history.map(({ dt: date, ...values }) => {
      const relative_engaged_recipients = (values.c_14d / values.c_total) * 100;

      return {
        ...values,
        date,
        engaged_recipients: values.c_14d,
        relative_engaged_recipients
      };
    });
    const filledHistory = fillByDate({
      dataSet: normalizedHistory,
      fill: {
        engaged_recipients: null,
        relative_engaged_recipients: null
      },
      now,
      relativeRange
    });

    return {
      ...rowOfData,
      current_engaged_recipients: _.last(filledHistory).engaged_recipients,
      current_relative_engaged_recipients: _.last(filledHistory).relative_engaged_recipients,
      history: filledHistory,
      total_engagement: history.reduce((total, { c_total }) => total + c_total, 0)
    };
  })
);

export const selectEngagementRecencyOverviewMetaData = createSelector(
  getEngagementRecencyData,
  ({ data }) => {
    const absoluteValues = _.flatMap(data, ({ history }) => history.map(({ c_14d }) => c_14d));
    const relativeValues = _.flatMap(data, ({ history }) => (
      history.map(({ c_14d, c_total }) => (c_14d / c_total) * 100)
    ));
    const currentValues = data.reduce((acc, { current_c_14d }) => {
      if (current_c_14d === null) {
        return acc; // ignore
      }

      return [...acc, current_c_14d];
    }, []);
    const currentRelativeValues = data.reduce((acc, { current_c_14d, current_c_total }) => {
      if (current_c_total === null) {
        return acc; // ignore
      }

      return [...acc, (current_c_14d / current_c_total) * 100];
    }, []);

    return {
      currentMax: currentValues.length ? Math.max(...currentValues) : null,
      currentRelativeMax: currentRelativeValues.length ? Math.max(...currentRelativeValues) : null,
      max: absoluteValues.length ? Math.max(...absoluteValues) : null,
      relativeMax: relativeValues.length ? Math.max(...relativeValues) : null
    };
  }
);

export const selectEngagementRecencyOverview = createSelector(
  [getEngagementRecencyData, selectEngagementRecencyOverviewData, selectEngagementRecencyOverviewMetaData],
  (engagementRecencyData, data, metaData) => ({
    ...engagementRecencyData,
    data,
    metaData
  })
);

export const selectHealthScoreOverviewData = createSelector(
  getHealthScoreData, getOptions,
  ({ data }, { now, relativeRange }) => data.map(({ current_health_score, ...rowOfData }) => {
    const history = rowOfData.history || [];
    const normalizedHistory = history.map(({ dt: date, health_score, ...values }) => {
      const roundedHealthScore = roundToPlaces(health_score * 100, 1);

      return {
        ...values,
        date,
        health_score: roundedHealthScore,
        ranking: roundedHealthScore < 75 ? 'bad' : 'good'
      };
    });
    const filledHistory = fillByDate({
      dataSet: normalizedHistory,
      fill: {
        health_score: null,
        ranking: null
      },
      now,
      relativeRange
    });

    return {
      ...rowOfData,
      current_health_score: _.last(filledHistory).health_score,
      history: filledHistory,
      average_health_score: roundToPlaces(
        normalizedHistory.reduce((total, { health_score }) => total + health_score, 0) / normalizedHistory.length,
        1
      )
    };
  })
);

export const selectHealthScoreOverview = createSelector(
  [getHealthScoreData, selectHealthScoreOverviewData],
  (healthScoreData, data) => ({
    ...healthScoreData,
    data
  })
);


export const selectSpamHitsOverviewData = createSelector(
  getSpamHitsData, getOptions,
  ({ data }, { now, relativeRange }) => data.map((rowOfData) => {
    const history = rowOfData.history || [];
    const normalizedHistory = history.map(({ dt: date, relative_trap_hits, ...values }) => ({
      ...values,
      date,
      // Less than one tenth percent of hits to injections is good
      ranking: relative_trap_hits > .001 ? 'bad' : 'good',
      relative_trap_hits: relative_trap_hits * 100
    }));
    const filledHistory = fillByDate({
      dataSet: normalizedHistory,
      fill: {
        injections: null,
        ranking: null,
        relative_trap_hits: null,
        trap_hits: null
      },
      now,
      relativeRange
    });

    return {
      ...rowOfData,
      current_relative_trap_hits: _.last(filledHistory).relative_trap_hits,
      history: filledHistory,
      total_injections: history.reduce((total, { injections }) => total + injections, 0)
    };
  })
);

export const selectSpamHitsOverviewMetaData = createSelector(
  getSpamHitsData,
  ({ data }) => {
    const absoluteValues = _.flatMap(data, ({ history }) => history.map(({ trap_hits }) => trap_hits));
    const relativeValues = _.flatMap(data, ({ history }) => history.map(({ relative_trap_hits }) => relative_trap_hits * 100));
    const currentValues = data.reduce((acc, { current_trap_hits }) => {
      if (current_trap_hits === null) {
        return acc; // ignore
      }

      return [...acc, current_trap_hits];
    }, []);
    const currentRelativeValues = data.reduce((acc, { current_relative_trap_hits }) => {
      if (current_relative_trap_hits === null) {
        return acc; // ignore
      }

      return [...acc, current_relative_trap_hits * 100];
    }, []);

    return {
      currentMax: currentValues.length ? Math.max(...currentValues) : null,
      currentRelativeMax: currentRelativeValues.length ? Math.max(...currentRelativeValues) : null,
      max: absoluteValues.length ? Math.max(...absoluteValues) : null,
      relativeMax: relativeValues.length ? Math.max(...relativeValues) : null
    };
  }
);

export const selectSpamHitsOverview = createSelector(
  [getSpamHitsData, selectSpamHitsOverviewData, selectSpamHitsOverviewMetaData],
  (spamHitsData, data, metaData) => ({
    ...spamHitsData,
    data,
    metaData
  })
);
