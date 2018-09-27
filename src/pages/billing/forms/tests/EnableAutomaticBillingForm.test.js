import React from 'react';
import { shallow } from 'enzyme';
import * as billingHelpers from 'src/helpers/billing';
import { EnableAutomaticBillingForm } from '../EnableAutomaticBillingForm';

jest.mock('src/helpers/billing');

describe('EnableAutomaticBillingForm', () => {
  const subject = (props = {}) => shallow(
    <EnableAutomaticBillingForm
      billingCountries={[
        { value: 'US', label: 'United States' }
      ]}
      currentPlan={{
        plan_volume_per_period: 15000,
        period: 'year'
      }}
      handleSubmit={(handler) => handler}
      getBillingCountries={() => (undefined)}
      {...props}
    />
  );

  it('renders form', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('calls getBillingCountries on mount', () => {
    const getBillingCountries = jest.fn();
    subject({ getBillingCountries });
    expect(getBillingCountries).toHaveBeenCalled();
  });

  it('renders loading panel', () => {
    const wrapper = subject({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders form disabled', () => {
    const wrapper = subject({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('creates billing, redirects, and shows alert on submit', async () => {
    const props = {
      billingCreate: jest.fn(() => Promise.resolve()),
      history: { push: jest.fn() },
      showAlert: jest.fn()
    };
    const wrapper = subject(props);
    const values = {
      billingAddress: {
        state: 'MD',
        zip: 21046
      },
      card: Symbol('card-info')
    };
    const preparedCardInfo = Symbol('prepared-card-info');
    billingHelpers.prepareCardInfo = jest.fn(() => preparedCardInfo);

    await wrapper.instance().onSubmit(values);

    expect(billingHelpers.prepareCardInfo).toHaveBeenCalledWith(values.card);
    expect(props.billingCreate).toHaveBeenCalledWith({ ...values, card: preparedCardInfo });
    expect(props.history.push).toHaveBeenCalledWith('/account/billing');
    expect(props.showAlert).toHaveBeenCalledWith(expect.objectContaining({ type: 'success' }));
  });
});
