import cases from 'jest-in-case';
import templatesReducer from '../templates';

const TEST_CASES = {
  'stores draft': {
    payload: { id: 'test-draft' },
    type: 'GET_DRAFT_TEMPLATE_SUCCESS'
  },
  'stores published': {
    payload: { id: 'test-published' },
    type: 'GET_PUBLISHED_TEMPLATE_SUCCESS'
  },
  'stores preview of draft': {
    meta: {
      context: {
        id: 'test-template',
        mode: 'draft'
      }
    },
    payload: {
      subject: 'Preview of Test Template',
      html: '<h1>Preview of Test Template</h1>'
    },
    type: 'GET_TEMPLATE_PREVIEW_SUCCESS'
  }
};

cases('Template reducer', (action) => {
  expect(templatesReducer(undefined, action)).toMatchSnapshot();
}, TEST_CASES);
