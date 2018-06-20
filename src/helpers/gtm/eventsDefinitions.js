import _ from 'lodash';


export function getFormDefinition(actionName, value) {
  const labelPath = 'meta.form';

  return (action) => {
    const result = _.isFunction(actionName) ? actionName(action) : { action: actionName };
    const label = _.get(action, labelPath);

    return _.assign({
      event: 'Interactions',
      category: 'Form',
      action: actionName,
      label,
      value
    }, result);
  };
}
