import requestHelperFactory from './requestHelperFactory';
import { brightback as brightbackAxios } from 'src/helpers/axiosInstances';
import _ from 'lodash';

export default requestHelperFactory({
  request: brightbackAxios,
  onSuccess: ({ response, dispatch, types, meta }) => {
    const results = _.get(response, 'data');

    dispatch({
      type: types.SUCCESS,
      payload: results,
      meta
    });

    return meta.onSuccess ? dispatch(meta.onSuccess({ results })) : results;
  }
});
