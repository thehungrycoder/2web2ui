import { fetch as fetchAccount, getPlans } from './account';
import { get as getCurrentUser, getGrants } from './currentUser';

// initialize some state used for access control
export function initializeAccessControl() {
  return (dispatch) => Promise.all([
    dispatch(fetchAccount()),
    dispatch(getPlans()),
    dispatch(getCurrentUser()).then(({ access_level }) => dispatch(getGrants({ role: access_level })))
  ])
    .then(() => dispatch({ type: 'ACCESS_CONTROL_READY' }));
}
