import _ from 'lodash';
import config from 'src/config';
import { createSelector } from 'reselect';
import { getDomains, isVerified } from 'src/selectors/sendingDomains';

export const selectTemplates = (state) => state.templates.list;
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

const selectSubaccountIdFromProps = (state, props) => props.subaccountId;

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

/**
 * Converts string formatted from address to json structure.
 * Example:
 * before: content.from = 'me@domain.com'
 * after: content.from = { name: null, email: 'me@domain.com'}
 * @param template
 * @returns {*} null or template with reformatted from field
 */
export const normalizeFromAddress = (template) => {
  if (_.isEmpty(template)) {
    return template; //just not to change whatever value it is
  }

  const { content } = template;
  if (_.isString(content.from)) {
    return {
      ...template,
      content: {
        ...content,
        from: {
          name: null,
          email: content.from
        }
      }
    };
  } else {
    return template;
  }
};

