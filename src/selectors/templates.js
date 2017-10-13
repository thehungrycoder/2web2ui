/* eslint-disable */
import { createSelector } from 'reselect';
import { formValues } from 'redux-form';
import sortMatch from 'src/helpers/sortMatch';

export const templatesListSelector = (state) => state.templates.list;
export const templateByIdSelector = (state, props) => state.templates.byId[props.match.params.id] || { draft: {}, published: {}};

const filtersSelector = (state) => state.form.templateFilters && state.form.templateFilters.values;

export const filteredTemplatesSelector = createSelector(
  templatesListSelector, filtersSelector,
  (list, filters = {}) => {
    let matches = list;
    const { search = false, status = {}, subaccount = {} } = filters;

    if (search) {
      matches = sortMatch(
        list, search,
        (item) => `${item.name} ID: ${item.id}`
      );
    }

    // console.log(matches)
    return matches;
  }
);
