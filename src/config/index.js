import defaultConfig from './default';
import _ from 'lodash';

const mergedConfig = _.merge({}, defaultConfig, _.get(window, 'SP.productionConfig', {}));

export default mergedConfig;
