/* eslint-disable */
import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import localforage from 'localforage';
import config from 'src/config';
import { getTestDataKey } from 'src/helpers/templates';
import _ from 'lodash';

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
  return (dispatch) => {

    dispatch(getTestData({ id, mode: 'draft' }));

    return dispatch(sparkpostApiRequest({
      type: 'GET_DRAFT_TEMPLATE',
      meta: {
        method: 'GET',
        url: `/templates/${id}`,
        params: {
          draft: true
        }
      }
    }));
  }
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
  const { testData, ...formData } = data;

  return (dispatch) => {

    dispatch(setTestData({
      id,
      mode: 'draft',
      data: testData
    }));

    return dispatch(sparkpostApiRequest({
      type: 'UPDATE_TEMPLATE',
      meta: {
        method: 'PUT',
        url: `/templates/${id}`,
        data: formData,
        params
      }
    }));
  }
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

export function setTestData({ data, id, mode }) {
  return (dispatch, getState) => {
    const username = getState().currentUser.username;

    return localforage.setItem(getTestDataKey({ id, username, mode }), data).then(() => {
      return dispatch({ type: 'SET_TEMPLATE_TEST_DATA' })
    });
  };
}

export function getTestData({ id, mode }) {
  return (dispatch, getState) => {
    const username = getState().currentUser.username;

    return localforage.getItem(getTestDataKey({ id, username, mode }))
      .then((results) => {
        console.log(results, id)
        let testData = config.templates.testData;

        if (results) {
          console.log(results)
          testData = JSON.parse(results);

          if (!['substitution_data', 'metadata', 'options'].every((key) => key in testData)) {
            testData = { ...config.templates.testData, substitution_data: testData };
            console.log('data', testData)
          }
        }

        return dispatch({
          type: 'GET_TEMPLATE_TEST_DATA',
          payload: {
            id,
            mode,
            testData
          }
        });
      });
  };
}
