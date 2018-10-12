import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';

export const createSnippet = (data) => (
  sparkpostApiRequest({
    type: 'CREATE_SNIPPET',
    meta: {
      method: 'POST',
      url: '/snippets',
      data
    }
  })
);
