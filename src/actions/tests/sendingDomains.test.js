import * as sendingDomains from '../sendingDomains';

jest.mock('../helpers/sparkpostApiRequest', () => jest.fn((a) => a));

describe('Action Creator: Sending Domains', () => {
  describe('Create', () => {
    it('domain should be assigned to master', async() => {
      expect(sendingDomains.create({ domain: 'domain.com' })).toMatchSnapshot();
    });

    it('domain should be assigned a subaccount', async() => {
      expect(sendingDomains.create({ domain: 'domain.com', subaccount: { id: 101 }})).toMatchSnapshot();
    });

    it('domain should be shared with all subaccount', async() => {
      expect(sendingDomains.create({ domain: 'domain.com', assignTo: 'shared' })).toMatchSnapshot();
    });
  });

  describe('Verify', () => {
    it('should dispatch verify cname action', () => {
      expect(sendingDomains.verifyCname({ id: 'domain.com' })).toMatchSnapshot();
    });

    it('should dispatch verify dkim action', () => {
      expect(sendingDomains.verifyDkim({ id: 'sub.com', subaccount: 101 })).toMatchSnapshot();
    });

    it('should dispatch verify abuse action', () => {
      expect(sendingDomains.verifyAbuse({ id: 'sub.com', subaccount: 101 })).toMatchSnapshot();
    });

    it('should dispatch verify mailbox action', () => {
      const args = { id: 'sub.com', mailbox: 'example', subaccount: 101 };
      expect(sendingDomains.verifyMailbox(args)).toMatchSnapshot();
    });

    it('should verify as postmaster when using the mailbox action', () => {
      expect(sendingDomains.verifyMailbox({ id: 'sub.com', mailbox: 'postmaster', subaccount: 101 })).toMatchSnapshot();
    });

    it('should verify as abuse when using the mailbox action', () => {
      expect(sendingDomains.verifyMailbox({ id: 'sub.com', mailbox: 'abuse', subaccount: 101 })).toMatchSnapshot();
    });

    it('should dispatch verify postmaster action', () => {
      expect(sendingDomains.verifyPostmaster({ id: 'sub.com', subaccount: 101 })).toMatchSnapshot();
    });
  });

  describe('Verify Token', () => {
    it('should dispatch verify abuse token action', () => {
      expect(sendingDomains.verifyAbuseToken({ id: 'sub.com', subaccount: 101, token: '12345' })).toMatchSnapshot();
    });

    it('should dispatch verify mailbox token action', () => {
      const args = { id: 'sub.com', mailbox: 'example@test.com', subaccount: 101, token: '12345' };
      expect(sendingDomains.verifyMailboxToken(args)).toMatchSnapshot();
    });

    it('should dispatch verify postmaster token action', () => {
      expect(sendingDomains.verifyPostmasterToken({ id: 'sub.com', subaccount: 101, token: '12345' })).toMatchSnapshot();
    });
  });

  describe('Update', () => {
    it('should request with correct post data', () => {
      expect(sendingDomains.update({ id: 'domain.com', is_default_bounce_domain: true })).toMatchSnapshot();
    });

    it('should update domain owned by subaccount', () => {
      expect(sendingDomains.update({ id: 'domain.com', subaccount: 101, is_default_bounce_domain: true })).toMatchSnapshot();
    });
  });

  describe('Remove', () => {
    const domain = 'example.com';
    const subaccount = 101;

    it('remove calls API', () => {
      expect(sendingDomains.remove({ id: domain })).toMatchSnapshot();
    });

    it('remove includes subaccount header with required', async() => {
      expect(sendingDomains.remove({ id: domain, subaccount })).toMatchSnapshot();
    });
  });
});
