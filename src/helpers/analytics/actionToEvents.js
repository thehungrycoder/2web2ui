import _ from 'lodash';
import { isWhitelistedForm } from './utils';


export function actionToFormEvent(actionName, value) {
  const labelPath = 'meta.form';

  return (action) => {
    const formName = _.get(action, labelPath);

    if (!isWhitelistedForm(formName)) { //returning null to skip sending the event to gtm, enforced via ensure callback
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
