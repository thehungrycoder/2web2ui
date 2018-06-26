import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../subaccounts';

jest.mock('../helpers/sparkpostApiRequest');

snapshotActionCases('Action: Subaccounts', {
  clearSubaccount: {
    action: actions.clearSubaccount
  },
  editSubaccount: {
    action: () => actions.editSubaccount(123, { name: 'Test Example' })
  },
  getSubaccount: {
    action: () => actions.getSubaccount(123)
  },
  list: {
    action: actions.list
  }
});
