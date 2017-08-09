
import defaultConfig from './env/default';
import development from './env/development';
import consolidatedTst from './env/consolidated-tst';
import _ from 'lodash';

const envs = { development, 'consolidated-tst': consolidatedTst };
const getConfig = (env = 'development') => (
  _.merge({}, defaultConfig, envs[env])
);
const currentEnv = (process.env.NODE_ENV === 'test') ? 'test' : process.env.REACT_APP_ENV;

export default getConfig(currentEnv);
