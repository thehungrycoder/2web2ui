import defaultConfig from './default';
import _ from 'lodash';

const mergedConfig = _.merge({}, defaultConfig, _.get(window, 'SP.productionConfig', {}));

// for easier debugging of config values
window.SP.config = mergedConfig;

export default mergedConfig;
