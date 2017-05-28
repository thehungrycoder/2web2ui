import { combineReducers } from 'redux';
import auth from './auth';
import account from './account';
import currentUser from './currentUser';
import metrics from './metrics';

export default combineReducers({
  auth,
  account,
  currentUser,
  metrics
});
