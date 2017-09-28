import _ from 'lodash';

export default function configFlag(flagPath) {
  return ({ config }) => _.get(config, flagPath, false);
}
