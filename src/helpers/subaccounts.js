import _ from 'lodash';

export const setSubaccountQuery = (id) => _.isNil(id) ? '' : `?subaccount=${id}`;
