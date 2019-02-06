import { any } from 'src/helpers/conditions';
import _ from 'lodash';

export const isHeroku = ({ currentUser }) => currentUser.access_level === 'heroku';

export const isAzure = ({ currentUser }) => currentUser.access_level === 'azure';

export const hasRole = (role) => ({ currentUser }) => currentUser.access_level === role;

export const isAdmin = any(hasRole('admin'), hasRole('superuser'));

export const isSubaccountUser = ({ currentUser }) => currentUser.access_level && currentUser.access_level.includes('subaccount');

export const isSso = ({ currentUser }) => currentUser.is_sso;

export const isEmailVerified = ({ currentUser }) => currentUser.email_verified;

export const isUserUiOptionSet = (option, defaultValue) => ({ currentUser }) => _.get(currentUser.options, `ui.${option}`, defaultValue);
