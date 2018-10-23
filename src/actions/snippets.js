import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export const createSnippet = ({
  html,
  id,
  name,
  sharedWithSubaccounts = false,
  subaccount,
  text
}) => (
  sparkpostApiRequest({
    type: 'CREATE_SNIPPET',
    meta: {
      method: 'POST',
      headers: setSubaccountHeader(subaccount),
      url: '/snippets',
      data: {
        // undefined content parts will not be sent with request
        content: {
          html,
          text
        },
        id,
        name,
        shared_with_subaccounts: subaccount ? false : sharedWithSubaccounts
      }
    }
  })
);

export const getSnippets = () => (
  sparkpostApiRequest({
    type: 'GET_SNIPPETS',
    meta: {
      method: 'GET',
      url: '/snippets'
    }
  })
);

export const deleteSnippet = ({ id, subaccountId }) => (
  sparkpostApiRequest({
    type: 'DELETE_SNIPPET',
    meta: {
      method: 'DELETE',
      url: `/snippets/${id}`,
      headers: setSubaccountHeader(subaccountId),
      data: { id, subaccountId }
    }
  })
);
