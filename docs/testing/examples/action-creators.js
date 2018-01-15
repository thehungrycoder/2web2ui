import { apiRequest } from './_example-mocks';

export function basicActionCreator({ name } = {}) {
  if (!name) {
    return {};
  }
  return {
    type: 'BASIC_ACTION',
    payload: {
      name
    }
  };
}

export function withThunk() {
  return (dispatch) => {
    dispatch({
      type: 'ACTION_ONE',
      payload: {
        loading: true
      }
    });

    dispatch({
      type: 'ACTION_TWO',
      payload: {
        value: 123
      }
    });
  };
}

export function dependsOnState() {
  return (dispatch, getState) => {
    const { name } = getState();
    dispatch({
      type: 'ACTION_FOR_NAME',
      payload: { name }
    });
  };
}

export function asyncMock() {
  return (dispatch) => dispatch(apiRequest({
    url: '/account',
    method: 'GET'
  }))
    .then(() => dispatch(apiRequest({
      url: '/other',
      method: 'PUT'
    })));
}

export function asyncDependent(values) {
  return (dispatch) => dispatch(apiRequest({
    url: '/account',
    method: 'GET'
  })).then(({ id }) => dispatch(apiRequest({
    url: `/account/${id}`,
    method: 'PUT',
    body: values
  }))).then(({ updated }) => dispatch({
    type: 'UPDATE_ACCOUNT_SUCCESS',
    payload: { updated }
  }));
}
