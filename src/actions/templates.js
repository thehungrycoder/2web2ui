import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import localforage from 'localforage';
import config from 'src/config';
import { getTestDataKey } from './helpers/templates';

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
  const { id, testData, ...formData } = data;

  return (dispatch) => {
    dispatch(setTestData({ id, mode: 'draft', data: testData }));

    return dispatch(sparkpostApiRequest({
      type: 'CREATE_TEMPLATE',
      meta: {
        method: 'POST',
        url: '/templates',
        data: { ...formData, id }
      }
    }));
  };
}

export function update(data, params = {}) {
  const { id, testData, ...formData } = data;

  return (dispatch) => {
    dispatch(setTestData({ id, mode: 'draft', data: testData }));

    return dispatch(sparkpostApiRequest({
      type: 'UPDATE_TEMPLATE',
      meta: {
        method: 'PUT',
        url: `/templates/${id}`,
        data: formData,
        params
      }
    }));
  };
}

export function publish(data) {
  return (dispatch) => {
    const { id, testData } = data;

    // Save draft first, then publish
    return dispatch(update(data)).then(() => {
      dispatch(setTestData({ id, mode: 'published', data: testData }));

      return dispatch(sparkpostApiRequest({
        type: 'PUBLISH_TEMPLATE',
        meta: {
          method: 'PUT',
          url: `/templates/${id}`,
          data: { published: true }
        }
      }));
    });
  };
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

export function setTestData({ data, id, mode }) {
  return (dispatch, getState) => {
    const username = getState().currentUser.username;
    const testData = typeof data === 'object' ? JSON.stringify(data) : data;
    return localforage.setItem(getTestDataKey({ id, username, mode }), testData).then(() => dispatch({ type: 'SET_TEMPLATE_TEST_DATA' }));
  };
}

export function getTestData({ id, mode }) {
  return (dispatch, getState) => {
    const username = getState().currentUser.username;

    return localforage.getItem(getTestDataKey({ id, username, mode })).then((results) => {
      let testData;

      if (results) {
        testData = JSON.parse(results);

        // Reshapes test data if it does not conform with default JSON structure
        if (!['substitution_data', 'metadata', 'options'].every((key) => key in testData)) {
          testData = { ...config.templates.testData, substitution_data: testData };
        }
      }

      return dispatch({
        type: 'GET_TEMPLATE_TEST_DATA',
        payload: testData
      });
    });
  };
}
