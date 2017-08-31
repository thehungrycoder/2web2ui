// import { getRelativeDates } from 'helpers/metrics';

// export function setRelativeTime(range) {
//   return (dispatch) => Promise.resolve(dispatch({
//     type: 'SET_RELATIVE_TIME',
//     payload: { ...getRelativeDates(range), range }
//   }));
// }

// export function setExactTime(rangeDates) {
//   return (dispatch) => Promise.resolve(dispatch({
//     type: 'SET_EXACT_TIME',
//     payload: { ...rangeDates, range: 'custom' }
//   }));
// }

export function addFilter(payload) {
  return {
    type: 'ADD_FILTER',
    payload
  };
}

export function removeFilter(payload) {
  return {
    type: 'REMOVE_FILTER',
    payload
  };
}

export function searchFilter(payload) {
  return {
    type: 'SEARCH_FILTER',
    payload: [
      { value: 'domain.com', type: 'domain' },
      { value: '123', type: 'subaccount' },
      { value: 'domain.net', type: 'domain' }
    ]
  };
}
