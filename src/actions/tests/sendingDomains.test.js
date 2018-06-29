import { snapshotActionCases } from 'src/__testHelpers__/snapshotActionHelpers';
import * as sendingDomains from '../sendingDomains';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

snapshotActionCases('Action Creator: Sending Domains', {
  'Create domain should be assigned to master': {
    action: () => sendingDomains.create({ domain: 'domain.com' })
  },
  'Create domain should be assigned a subaccount': {
    action: () => sendingDomains.create({ domain: 'domain.com', subaccount: { id: 101 }})
  },
  'Create domain should be shared with all subaccount': {
    action: () => sendingDomains.create({ domain: 'domain.com', assignTo: 'shared' })
  },
  'Verify should dispatch verify cname action': {
    action: () => sendingDomains.verifyCname({ id: 'domain.com' })
  },
  'Verify should dispatch verify dkim action': {
    action: () => sendingDomains.verifyDkim({ id: 'sub.com', subaccount: 101 })
  },
  'Verify should dispatch verify abuse action': {
    action: () => sendingDomains.verifyAbuse({ id: 'sub.com', subaccount: 101 })
  },
  'Verify should dispatch verify mailbox action': {
    action: () => sendingDomains.verifyMailbox({ id: 'sub.com', mailbox: 'example', subaccount: 101 })
  },
  'Verify should verify as postmaster when using the mailbox action': {
    action: () => sendingDomains.verifyMailbox({ id: 'sub.com', mailbox: 'postmaster', subaccount: 101 })
  },
  'Verify should verify as abuse when using the mailbox action': {
    action: () => sendingDomains.verifyMailbox({ id: 'sub.com', mailbox: 'abuse', subaccount: 101 })
  },
  'Verify should dispatch verify postmaster action': {
    action: () => sendingDomains.verifyPostmaster({ id: 'sub.com', subaccount: 101 })
  },
  'Verify Token should dispatch verify abuse token action': {
    action: () => sendingDomains.verifyAbuseToken({ id: 'sub.com', subaccount: 101, token: '12345' })
  },
  'Verify Token should dispatch verify mailbox token action': {
    action: () => sendingDomains.verifyMailboxToken({ id: 'sub.com', mailbox: 'example@test.com', subaccount: 101, token: '12345' })
  },
  'Verify Token should dispatch verify postmaster token action': {
    action: () => sendingDomains.verifyPostmasterToken({ id: 'sub.com', subaccount: 101, token: '12345' })
  },
  'Update should request with correct post data': {
    action: () => sendingDomains.update({ id: 'domain.com', is_default_bounce_domain: true })
  },
  'Update should update domain owned by subaccount': {
    action: () => sendingDomains.update({ id: 'domain.com', subaccount: 101, is_default_bounce_domain: true })
  },
  'Remove should remove calls API': {
    action: () => sendingDomains.remove({ id: 'example.com' })
  },
  'Remove should remove includes subaccount header with required': {
    action: () => sendingDomains.remove({ id: 'example.com', subaccount: 101 })
  },
  'should request a list': {
    action: sendingDomains.list
  },
  'should request a sending domain': {
    action: () => sendingDomains.get(123)
  },
  'should clear current sending domain': {
    action: sendingDomains.clearSendingDomain
  }
});
