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
    it('it should request with correct post data', () => {
      expect(sendingDomains.verify({ id: 'domain.com', type: 'cname' })).toMatchSnapshot();
    });

    it('it should verify domain owned by subaccount', () => {
      expect(sendingDomains.verify({ id: 'sub.com', subaccount: 101, type: 'cname' })).toMatchSnapshot();
    });
  });

  describe('Update', () => {
    it('it should request with correct post data', () => {
      expect(sendingDomains.update({ id: 'domain.com', is_default_bounce_domain: true })).toMatchSnapshot();
    });

    it('it update domain owned by subaccount', () => {
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
