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


