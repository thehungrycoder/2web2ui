import _ from 'lodash';
import config from 'src/config';

export const configFlag = (path) => () => _.get(config, path, false);

export const configEquals = (path, value) => () => _.get(config, path) === value;

export const configNotEquals = (path, value) => () => _.get(config, path) !== value;
