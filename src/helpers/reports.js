import moment from 'moment';
import qs from 'query-string';
import _ from 'lodash';

function getFilterSearchOptions(filters) {
  return {
    from: moment(filters.from).utc().format(),
    to: moment(filters.to).utc().format(),
    filters: filters.activeList.map((filter) => `${filter.type}:${filter.value}`)
  };
}

function getSearch(options) {
  return _.isEmpty(options) ? '' : `?${qs.stringify(options, { encode: false })}`;
}

function getShareLink(options) {
  return `${window.location.href.split('?')[0]}${getSearch(options)}`;
}

export {
  getFilterSearchOptions,
  getSearch,
  getShareLink
};
