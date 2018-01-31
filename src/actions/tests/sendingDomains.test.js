import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import * as sendingDomains from '../sendingDomains';

jest.mock('src/actions/helpers/sparkpostApiRequest', () => jest.fn((a) => a));

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

  describe('Remove', () => {
    const domain = 'example.com';
    const subaccount = 101;

    it('remove calls API', async() => {
      await sendingDomains.remove(domain);
      expect(sparkpostApiRequest).toHaveBeenCalledWith({
        type: 'DELETE_SENDING_DOMAIN',
        meta: {
          url: `/sending-domains/${domain}`,
          method: 'DELETE',
          headers: {}
        }
      });
    });

    it('remove includes subaccount header with required', async() => {
      await sendingDomains.remove(domain, subaccount);
      expect(sparkpostApiRequest).toHaveBeenCalledWith({
        type: 'DELETE_SENDING_DOMAIN',
        meta: {
          url: `/sending-domains/${domain}`,
          method: 'DELETE',
          headers: { 'x-msys-subaccount': subaccount }
        }
      });
    });
  });
});
