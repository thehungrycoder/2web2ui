import _ from 'lodash';


/**
 * Converts string formatted from address to object
 * @param {string} from
 * @returns {*} {name: null, email: from}
 */
export const normalizeFromAddress = (from) => {
  if (_.isString(from)) {
    return {
      name: null,
      email: from
    };
  } else {
    return from;
  }
};

/**
 * Converts string formatted from address to json structure in a template.
 * Example:
 * before: content.from = 'me@domain.com'
 * after: content.from = { name: null, email: 'me@domain.com'}
 * @param template
 * @returns {*} null or template with reformatted from field
 */
export const normalizeTemplateFromAddress = (template) => {
  if (_.isEmpty(template)) {
    return template; //just not to change whatever value it is
  }

  const { content } = template;

  return {
    ...template,
    content: {
      ...content,
      from: normalizeFromAddress(content.from)
    }
  };
};

export const resolveTemplateStatus = ({ has_draft, has_published, published } = {}) => ({
  // The template is published with no unpublished changes
  published,

  // A published template with a draft that contains unpublished changes
  publishedWithChanges: !published && has_draft && has_published,

  // Unpublished draft template
  draft: !published && !has_published
});


/**
 * Filters a list of templates available for use for the given subaccount
 */
export const filterTemplatesBySubaccount = ({ templates, subaccountId, hasSubaccounts }) => {
  if (hasSubaccounts) {
    return _.filter(templates, (template) => subaccountId
      ? template.shared_with_subaccounts || template.subaccount_id === Number(subaccountId)
      : !template.subaccount_id);
  } else {
    return templates;
  }
};
