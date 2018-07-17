import _ from 'lodash';
import * as utils from './utils';


export function getFormDefinition(actionName, value) {
  const labelPath = 'meta.form';

  return (action) => {
    const formName = _.get(action, labelPath);

    if (!utils.isWhitelistedForm(formName)) {
      return null;
    }

    const result = _.isFunction(actionName) ? actionName(action) : { action: actionName };

    return _.assign({
      event: 'Interactions',
      category: 'Form',
      action: actionName,
      label: formName,
      value
    }, result);
  };
}
