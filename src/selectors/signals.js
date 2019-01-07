import { createSelector } from 'reselect';
import { fillByDate } from 'src/helpers/date';
import { selectSubaccountIdFromQuery } from 'src/selectors/subaccounts';
import _ from 'lodash';
import moment from 'moment';

// Router props
export const getFacetFromParams = (state, props) => _.get(props, 'match.params.facet');
export const getFacetIdFromParams = (state, props) => _.get(props, 'match.params.facetId');
export const getSelectedDateFromRouter = (state, props) => _.get(props, 'location.state.date');
export const getSignalOptions = (state, props) => _.get(state, 'signalOptions', {});
export const getOptions = (state, options) => options;

// Redux store
export const getSpamHitsData = (state, props) => _.get(state, 'signals.spamHits', {});
export const getEngagementRecencyData = (state, props) => _.get(state, 'signals.engagementRecency', {});

// Details
export const selectSpamHitsDetails = createSelector(
  [getSpamHitsData, getFacetFromParams, getFacetIdFromParams, selectSubaccountIdFromQuery, getSignalOptions],
  ({ loading, error, data }, facet, facetId, subaccountId, { relativeRange }) => {
    const match = _.find(data, [facet, facetId]) || {};
    const history = match.history || [];
    const normalizedHistory = history.map(({ dt: date, ...values }) => ({ date, ...values }));

    const filledHistory = fillByDate({
      dataSet: normalizedHistory,
      fill: {
        injections: null,
        relative_trap_hits: null,
        trap_hits: null
      },
      now: moment().subtract(1, 'day'),
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
  [getEngagementRecencyData, getFacetFromParams, getFacetIdFromParams, selectSubaccountIdFromQuery, getSignalOptions],
  ({ loading, error, data }, facet, facetId, subaccountId, { relativeRange }) => {
    const match = _.find(data, [facet, facetId]) || {};

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
      now: moment().subtract(1, 'day'),
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

// Overview
export const selectSpamHitsOverviewData = createSelector(
  getSpamHitsData, getOptions,
  ({ data }, { relativeRange }) => data.map((rowOfData) => {
    const history = rowOfData.history || [];
    const normalizedHistory = history.map(({ dt: date, ...values }) => ({
      ...values,
      date,
      // Less than one tenth percent of hits to injections is good
      ranking: values.relative_trap_hits > .1 ? 'bad' : 'good'
    }));
    const filledHistory = fillByDate({
      dataSet: normalizedHistory,
      fill: {
        injections: null,
        ranking: null,
        relative_trap_hits: null,
        trap_hits: null
      },
      now: moment().subtract(1, 'day'),
      relativeRange
    });

    return {
      ...rowOfData,
      history: filledHistory,
      total_injections: history.reduce((total, { injections }) => total + injections, 0)
    };
  })
);

export const selectSpamHitsOverviewMetaData = createSelector(
  getSpamHitsData,
  ({ data }) => {
    const absoluteValues = _.flatMap(data, ({ history }) => history.map(({ trap_hits }) => trap_hits));
    const relativeValues = _.flatMap(data, ({ history }) => history.map(({ relative_trap_hits }) => relative_trap_hits));
    const currentValues = data.map(({ current_trap_hits }) => current_trap_hits);
    const currentRelativeValues = data.map(({ current_relative_trap_hits }) => current_relative_trap_hits);

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
