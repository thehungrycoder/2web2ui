import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export const createSnippet = ({
  html,
  id,
  name,
  sharedWithSubaccounts = false,
  subaccountId,
  text
}) => (
  sparkpostApiRequest({
    type: 'CREATE_SNIPPET',
    meta: {
      method: 'POST',
      headers: setSubaccountHeader(subaccount),
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
