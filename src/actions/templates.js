import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export function listTemplates() {
  return sparkpostApiRequest({
    type: 'LIST_TEMPLATES',
    meta: {
      method: 'GET',
      url: '/templates'
    }
  });
}

export function getDraft(id) {
  return sparkpostApiRequest({
    type: 'GET_DRAFT_TEMPLATE',
    meta: {
      method: 'GET',
      url: `/templates/${id}`,
      params: {
        draft: true
      }
    }
  });
}

export function getPublished(id) {
  return sparkpostApiRequest({
    type: 'GET_PUBLISHED_TEMPLATE',
    meta: {
      method: 'GET',
      url: `/templates/${id}`,
      params: {
        draft: false
      }
    }
  });
}

export function create(data) {
  return sparkpostApiRequest({
    type: 'CREATE_TEMPLATE',
    meta: {
      method: 'POST',
      url: '/templates',
      data
    }
  });
}

export function update(data, params = {}) {
  const id = data.id;
  return sparkpostApiRequest({
    type: 'UPDATE_TEMPLATE',
    meta: {
      method: 'PUT',
      url: `/templates/${id}`,
      data,
      params: { ...params }
    }
  });
}

export function publish(id) {
  return sparkpostApiRequest({
    type: 'PUBLISH_TEMPLATE',
    meta: {
      method: 'PUT',
      url: `/templates/${id}`,
      data: { published: true }
    }
  });
}

export function deleteTemplate(id) {
  return sparkpostApiRequest({
    type: 'DELETE_TEMPLATE',
    meta: {
      method: 'DELETE',
      url: `/templates/${id}`
    }
  });
}
