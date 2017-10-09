import _ from 'lodash';
import getGrantsList from 'src/selectors/getGrantsList';

const compareGrants = (required, grants) => (
  _.difference(required, grants).length === 0
);

const memoizedCompareGrants = _.memoize(
  compareGrants,
  (required, grants) => `${required.join('')}::${grants.join('')}`
);

export default function hasGrants(...required) {
  return (accessConditionState) => memoizedCompareGrants(required, getGrantsList(accessConditionState));
}
