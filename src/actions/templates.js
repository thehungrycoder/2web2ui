export function listTemplates () {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'LIST_TEMPLATES',
      method: 'GET',
      url: `/templates`
    }
  };
}

export function getTemplate (id) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_TEMPLATE',
      method: 'GET',
      url: `/templates/${id}`
    }
  };
}

export function createTemplate () {
  return (dispatch, getState) => {
    const data = getState().form.templateEdit.values;

    dispatch({
      type: 'SPARKPOST_API_REQUEST',
      meta: {
        type: 'CREATE_TEMPLATE',
        method: 'POST',
        url: '/templates',
        data
      }
    });
  };
}

export function updateTemplate (params = {}) {
  return (dispatch, getState) => {
    const data = getState().form.templateEdit.values;
    const id = data.id;

    dispatch({
      type: 'SPARKPOST_API_REQUEST',
      meta: {
        type: 'UPDATE_TEMPLATE',
        method: 'PUT',
        url: `/templates/${id}`,
        data,
        params: {
          ...params
        }
      }
    });
  };
}

export function resetTemplate () {
  return {
    type: 'RESET_TEMPLATE'
  };
}
