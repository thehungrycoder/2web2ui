import { createSelector } from 'reselect';
import _ from 'lodash';

const getGrants = (state) => _.get(state, 'currentUser.grants', []);
const getGrantsList = createSelector(
  [getGrants],
  (grants) => grants.map((g) => g.key)
);

export default getGrantsList;
