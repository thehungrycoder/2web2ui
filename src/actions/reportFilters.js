export function setRelativeTime (payload) {
  return {
    type: 'SET_RELATIVE_TIME',
    payload
  };
}

export function setExactTime (payload) {
  return (dispatch) => {
    dispatch({
      type: 'SET_EXACT_TIME',
      payload
    });
    return Promise.resolve();
  };
}

export function addFilter (payload) {
  return {
    type: 'ADD_FILTER',
    payload
  };
}

export function removeFilter (payload) {
  return {
    type: 'REMOVE_FILTER',
    payload
  };
}

export function searchFilter (payload) {
  return {
    type: 'SEARCH_FILTER',
    payload: [
      { value: 'domain.com', type: 'domain' },
      { value: '123', type: 'subaccount' },
      { value: 'domain.net', type: 'domain' }
    ]
  };
}
