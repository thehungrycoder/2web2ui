import React from 'react';
import { shallow } from 'enzyme';
import SuspendedForBilling from '../SuspendedForBilling';

jest.mock('../../forms/UpdatePayment', () => function UpdatePaymentForm() {});
jest.mock('src/config', () => ({
  contact: {
    billingEmail: 'billing.email@example.com'
  }
}));

describe('Component: SuspendedForBilling', () => {

  it('should render correctly', () => {
    const props = {
      account: {
        billing: {
          email: 'account.billing.email@example.com'
        }
      }
    };
    expect(shallow(<SuspendedForBilling {...props} />)).toMatchSnapshot();
  });

});
