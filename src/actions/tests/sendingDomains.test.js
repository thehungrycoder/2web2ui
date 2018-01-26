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
      expect(sendingDomains.verify('domain.com', 'cname')).toMatchSnapshot();
    });
  });

  describe('Update', () => {
    it('it should request with correct post data', () => {
      expect(sendingDomains.update('domain.com', { is_default_bounce_domain: true })).toMatchSnapshot();
    });
  });
});
