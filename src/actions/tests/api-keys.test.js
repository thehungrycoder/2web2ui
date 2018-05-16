import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as actions from '../api-keys';

jest.mock('../helpers/sparkpostApiRequest');
const TEST_GRANTS = ['metrics/read', 'webhooks/modify'];

snapshotActionCases('Action Creator: Api Keys', [
  {
    name: 'listApiKeys (no subaccount specified)',
    action: actions.listApiKeys
  },
  {
    name: 'listApiKeys (with subaccount specified)',
    action: () => actions.listApiKeys(1234)
  },
  {
    name: 'listGrants',
    action: actions.listGrants
  },
  {
    name: 'createApiKey (no subaccount)',
    action: () => actions.createApiKey({
      grants: TEST_GRANTS,
      label: 'test label',
      validIps: ['1.1.1.1', '2.2.2.2']
    })
  },
  {
    name: 'createApiKey (with subaccount)',
    action: () => actions.createApiKey({
      grants: TEST_GRANTS,
      label: 'test label with subaccount',
      subaccount: 1234,
      validIps: ['1.1.1.1', '2.2.2.2']
    })
  },
  {
    name: 'getApiKey (no subaccount)',
    action: () => actions.getApiKey({
      id: 'ABC123ID'
    })
  },
  {
    name: 'getApiKey (with subaccount)',
    action: () => actions.getApiKey({
      id: 'ABC123ID',
      subaccount: 1234
    })
  },
  {
    name: 'deleteApiKey (no subaccount)',
    action: () => actions.deleteApiKey({
      id: 'ABC123ID'
    })
  },
  {
    name: 'deleteApiKey (with subaccount)',
    action: () => actions.deleteApiKey({
      id: 'ABC123ID',
      subaccount: 1234
    })
  },
  {
    name: 'updateApiKey (no subaccount)',
    action: () => actions.updateApiKey({
      id: 'ABC123ID',
      grants: TEST_GRANTS,
      label: 'test label',
      validIps: ['1.1.1.1', '2.2.2.2']
    })
  },
  {
    name: 'updateApiKey (with subaccount)',
    action: () => actions.updateApiKey({
      id: 'ABC123ID',
      grants: TEST_GRANTS,
      label: 'test label with subaccount',
      subaccount: 1234,
      validIps: ['1.1.1.1', '2.2.2.2']
    })
  },
  {
    name: 'hideNewApiKey',
    action: actions.hideNewApiKey
  },
  {
    name: 'listSubaccountGrants',
    action: actions.listSubaccountGrants
  }
]);
