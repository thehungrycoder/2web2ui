import { createSelector } from 'reselect';
import sortMatch from 'src/helpers/sortMatch';

export const getTemplates = (state) => state.templates.list;
export const getTemplateById = (state, props) => state.templates.byId[props.match.params.id] || { draft: {}, published: {}};

const getFilters = (state) => state.form.templateFilters && state.form.templateFilters.values;

export const getfilterTemplates = createSelector(
  getTemplates, getFilters,
  (list, filters = {}) => {
    let matches = list;
    const { search, status = {}, subaccount = {}} = filters;

    if (search) {
      matches = sortMatch(
        matches, search,
        (item) => `${item.name} ID: ${item.id} Subaccount: ${item.subaccount_id}`
      );
    }

    return matches.filter((item) => filterStatus(item, status) && filterSubaccount(item, subaccount));
  }
);

const filterStatus = (item, filter) => {
  if (!filter.draft && !filter.published) {
    return true;
  }

  if (filter.draft && !item.published) {
    return true;
  }

  if (filter.published && item.published) {
    return true;
  }

  return false;
};

const filterSubaccount = (item, filter) => {
  if (!filter.all && !filter.master && !filter.subaccount) {
    return true;
  }

  if (filter.all && item.shared_with_subaccounts && !item.subaccount_id) {
    return true;
  }

  if (filter.subaccount && item.subaccount_id) {
    return true;
  }

  if (filter.master && !item.shared_with_subaccounts && !item.subaccount_id) {
    return true;
  }

  return false;
};
