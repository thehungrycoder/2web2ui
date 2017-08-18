export function listTemplates() {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'LIST_TEMPLATES',
      method: 'GET',
      url: '/templates'
    }
  };
}

export function getDraft(id) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_DRAFT_TEMPLATE',
      method: 'GET',
      url: `/templates/${id}`,
      params: {
        draft: true
      }
    }
  };
}

export function getPublished(id) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'GET_PUBLISHED_TEMPLATE',
      method: 'GET',
      url: `/templates/${id}`,
      params: {
        draft: false
      }
    }
  };
}

export function create(data) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'CREATE_TEMPLATE',
      method: 'POST',
      url: '/templates',
      data
    }
  };
}

export function update(data, params = {}) {
  const id = data.id;
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'UPDATE_TEMPLATE',
      method: 'PUT',
      url: `/templates/${id}`,
      data,
      params: { ...params }
    }
  };
}

export function publish(id) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'PUBLISH_TEMPLATE',
      method: 'PUT',
      url: `/templates/${id}`,
      data: { published: true }
    }
  };
}

export function deleteTemplate(id) {
  return {
    type: 'SPARKPOST_API_REQUEST',
    meta: {
      type: 'DELETE_TEMPLATE',
      method: 'DELETE',
      url: `/templates/${id}`
    }
  };
}

export function clear() {
  return {
    type: 'CLEAR_TEMPLATE'
  };
}
