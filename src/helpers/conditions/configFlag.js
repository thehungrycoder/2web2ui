import _ from 'lodash';
import config from 'src/config';

export default function configFlag(flagPath) {
  return () => _.get(config, flagPath, false);
}
