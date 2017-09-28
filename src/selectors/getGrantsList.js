import { createSelector } from 'reselect';

const getGrants = (store) => store.currentUser.grants;
const getGrantsList = createSelector(
  [getGrants],
  (grants) => grants.map((g) => g.key)
);

export default getGrantsList;
