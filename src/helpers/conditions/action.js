import _ from 'lodash';

// Redux Action Conditions
export const isError = (name) => (action) => name === _.get(action, 'payload.error.name');
export const isFormIncluded = (forms) => (action) => forms.includes(_.get(action, 'meta.form'));
export const isType = (type) => (action) => type === action.type;
export const isTypeLike = (regex) => (action) => regex.test(action.type);
