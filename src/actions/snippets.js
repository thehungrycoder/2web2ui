import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export const createSnippet = ({ id, name, sharedWithSubaccounts = false, subaccount }) => (
  sparkpostApiRequest({
    type: 'CREATE_SNIPPET',
    meta: {
      method: 'POST',
      headers: setSubaccountHeader(subaccount),
      url: '/snippets',
      data: {
        id,
        name,
        shared_with_subaccounts: subaccount ? false : sharedWithSubaccounts
      }
    }
  })
);
