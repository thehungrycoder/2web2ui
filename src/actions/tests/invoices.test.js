import sparkpostApiRequest from 'src/actions/helpers/sparkpostApiRequest';
import * as invoices from '../invoices';

jest.mock('src/actions/helpers/sparkpostApiRequest', () => jest.fn((a) => a));

describe('Action Creator: Invoices', () => {

  it('should make a request to get the invoices', async () => {
    await invoices.list();
    expect(sparkpostApiRequest).toHaveBeenCalledTimes(1);
    expect(sparkpostApiRequest).toHaveBeenCalledWith(
      {
        type: 'LIST_INVOICES',
        meta: {
          method: 'GET',
          url: '/account/invoices'
        }
      }
    );
  });

  it('should make a request to get a specific invoice', async () => {
    await invoices.get('thisId');
    expect(sparkpostApiRequest).toHaveBeenCalledTimes(1);
    expect(sparkpostApiRequest).toHaveBeenCalledWith(
      {
        type: 'GET_INVOICE',
        meta: {
          method: 'GET',
          url: '/account/invoices/thisId',
          responseType: 'blob',
          invoiceId: 'thisId'
        }
      }
    );
  });

});
