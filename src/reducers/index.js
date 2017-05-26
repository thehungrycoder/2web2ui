import { combineReducers } from 'redux';
import auth from './auth';
import account from './account';
import currentUser from './currentUser';

export default combineReducers({
  account,
  currentUser,
  auth
})