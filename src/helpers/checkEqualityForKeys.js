import _ from 'lodash';

export default function checkEqualityForKeys({ a, b, keys }) {
  return keys.every((key) => _.isEqual(a[key], b[key]));
}
