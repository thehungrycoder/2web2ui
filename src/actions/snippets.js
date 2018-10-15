import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import setSubaccountHeader from './helpers/setSubaccountHeader';

export const createSnippet = ({
  html = '',
  id,
  name,
  sharedWithSubaccounts = false,
  subaccount,
  text = ''
}) => (
  sparkpostApiRequest({
    type: 'CREATE_SNIPPET',
    meta: {
      method: 'POST',
      headers: setSubaccountHeader(subaccount),
      url: '/snippets',
      data: {
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
