import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import auth from './auth';
import account from './account';
import currentUser from './currentUser';
import metrics from './metrics';
import webhooks from './webhooks';

export default combineReducers({
  auth,
  account,
  currentUser,
  metrics,
  webhooks,
  form: reduxFormReducer
});
