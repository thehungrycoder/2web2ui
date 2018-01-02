import templatesReducer from '../templates';

test('stores preview payload as contentPreview.draft', () => {
  const action = {
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
  };

  expect(templatesReducer(undefined, action)).toMatchSnapshot();
});
