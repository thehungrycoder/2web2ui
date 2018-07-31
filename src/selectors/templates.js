import _ from 'lodash';
import config from 'src/config';
import { createSelector } from 'reselect';
import { getDomains, isVerified } from 'src/selectors/sendingDomains';
import { selectSubaccountIdFromProps, selectSubaccountIdFromForm } from 'src/selectors/subaccounts';

export const selectTemplates = (state) => state.templates.list;
export const selectPublishedTemplates = (state) => _.filter(state.templates.list, (template) => template.has_published);
export const selectTemplateById = (state, props) => state.templates.byId[props.match.params.id] || { draft: {}, published: {}};

export const selectDraftTemplate = (state, id) => _.get(state, ['templates', 'byId', id, 'draft']);
export const selectPublishedTemplate = (state, id) => _.get(state, ['templates', 'byId', id, 'published']);
export const selectDraftTemplatePreview = (state, id) => state.templates.contentPreview.draft[id];
export const selectPublishedTemplatePreview = (state, id) => state.templates.contentPreview.published[id];

export const selectDefaultTestData = () => JSON.stringify(config.templates.testData, null, 2);
export const selectTemplateTestData = (state) => JSON.stringify(state.templates.testData || config.templates.testData, null, 2);

export const cloneTemplate = (template) => Object.assign({ ...template }, { name: `${template.name} Copy`, id: `${template.id}-copy` });

export const selectClonedTemplate = (state, props) => {
  const template = selectTemplateById(state, props);

  if (_.get(props, 'match.params.id') && !_.isEmpty(template.draft)) {
    return cloneTemplate(template.draft);
  }
};

// Selects sending domains for From Email typeahead
export const selectDomainsBySubaccount = createSelector(
  [getDomains, selectSubaccountIdFromProps],
  (domains, subaccountId) => _.filter(domains, (domain) => {

    if (!isVerified(domain)) {
      return false;
    }

    return subaccountId
      ? domain.shared_with_subaccounts || domain.subaccount_id === Number(subaccountId)
      : !domain.subaccount_id;
  })
);

// Selects published templates, filtered by subaccount
export const selectPublishedTemplatesBySubaccount = createSelector(
  [selectPublishedTemplates, selectSubaccountIdFromForm],
  (templates, subaccountId) => _.filter(templates, (template) => subaccountId
    ? template.shared_with_subaccounts || template.subaccount_id === Number(subaccountId)
    : !template.subaccount_id)
);
