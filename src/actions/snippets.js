import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export const clearSnippet = () => ({ type: 'CLEAR_SNIPPET' });

export const createSnippet = ({
  html,
  id,
  name,
  sharedWithSubaccounts = false,
  subaccountId,
  text,
  amp_html,
  isAmpLive
}) => {
  const opts = {
    type: 'CREATE_SNIPPET',
    meta: {
      method: 'POST',
      headers: setSubaccountHeader(subaccountId),
      url: '/labs/snippets',
      data: {
        // undefined content parts will not be sent with request
        content: {
          html,
          text
        },
        id,
        name,
        shared_with_subaccounts: subaccountId ? false : sharedWithSubaccounts
      }
    }
  };

  if (isAmpLive) {
    opts.meta.data.content.amp_html = amp_html;
  }

  return sparkpostApiRequest(opts);
};

export const getSnippet = ({ id, subaccountId }) => (
  sparkpostApiRequest({
    type: 'GET_SNIPPET',
    meta: {
      method: 'GET',
      headers: setSubaccountHeader(subaccountId),
      url: `/labs/snippets/${id}`,
      context: { id, subaccountId }
    }
  })
);

export const getSnippets = () => (
  sparkpostApiRequest({
    type: 'GET_SNIPPETS',
    meta: {
      method: 'GET',
      url: '/labs/snippets'
    }
  })
);

export const deleteSnippet = ({ id, subaccountId }) => (
  sparkpostApiRequest({
    type: 'DELETE_SNIPPET',
    meta: {
      method: 'DELETE',
      url: `/labs/snippets/${id}`,
      headers: setSubaccountHeader(subaccountId),
      context: { id, subaccountId }
    }
  })
);

export const updateSnippet = ({
  html,
  id,
  name,
  sharedWithSubaccounts = false,
  subaccountId,
  text,
  amp_html,
  isAmpLive
}) => {
  const opts = {
    type: 'UPDATE_SNIPPET',
    meta: {
      method: 'PUT',
      headers: setSubaccountHeader(subaccountId),
      url: `/labs/snippets/${id}`,
      data: {
        // undefined content parts will not be sent with request
        content: {
          html,
          text
        },
        name,
        shared_with_subaccounts: subaccountId ? false : sharedWithSubaccounts
      }
    }
  };

  if (isAmpLive) {
    opts.meta.data.content.amp_html = amp_html;
  }

  return sparkpostApiRequest(opts);
};
