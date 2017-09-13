import defaultConfig from './default';
import testConfig from './test-config';
import _ from 'lodash';

const prodConfig = _.get(window, 'SP.productionConfig', {});
const maybeTestConfig = process.env.NODE_ENV === 'test' ? testConfig : {};
const mergedConfig = _.merge({}, defaultConfig, prodConfig, maybeTestConfig);

export default mergedConfig;
