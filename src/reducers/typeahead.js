import _ from 'lodash';

const initialState = {
  from: null,
  to: null,
  cache: {}
};

export default (state = initialState, action) => {
  switch (action.type) {

    case 'UPDATE_TYPEAHEAD_METRICS_CACHE': {
      const { to, from, itemToCache } = action.payload;
      // If the dates are different, replace the existing cache with the new item to cache
      if (to !== state.to || from !== state.from) {
        return { ...state, to, from, cache: itemToCache };
      }
      // else, append the new item to the cache
      const cache = _.assign(state.cache, itemToCache);
      return { ...state, cache };
    }

    default:
      return state;
  }
};
