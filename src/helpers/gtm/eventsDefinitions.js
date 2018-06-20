import _ from 'lodash';


export function getFormDefinition(actionName, labelPath = 'meta.form', value) {
  return (action) => ({
    event: 'Interactions',
    category: 'Form',
    action: actionName,
    label: _.isFunction(labelPath) ? labelPath(action) : _.get(action, labelPath),
    value
  });
}
