import React from 'react';
import { shallow } from 'enzyme';
import { UsageReport } from '../UsageReport';

describe('UsageReport Component', () => {

  let getAccount;
  let props;

  beforeEach(() => {
    getAccount = jest.fn();

    props = {
      subscription: {
        plan_volume: 10000
      },
      usage: {
        month: {
          used: 1000,
          limit: 50000,
          start: '2017-08-01T08:00:00.000Z',
          end: '2017-08-31T08:00:00.000Z'
        },
        day: {
          used: 1000,
          limit: 2000,
          start: '2017-08-30T00:00:00.000Z'
        }
      },
      getAccount,
      accountAgeInWeeks: 4
    };
  });

  it('should render null without props', () => {
    const props = { getAccount };
    const wrapper = shallow(<UsageReport {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render with regular usage', () => {
    const wrapper = shallow(<UsageReport {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('DisplayNumber').at(0).dive()).toMatchSnapshot();
    expect(wrapper.find('ProgressLabel').at(0).dive()).toMatchSnapshot();
  });

  it('should get the account including usage', () => {
    shallow(<UsageReport {...props} />);
    expect(props.getAccount).toHaveBeenCalledWith({ include: 'usage' });
  });

  it('should render with overages', () => {
    props.usage.month.used = props.subscription.plan_volume + 1000;
    const wrapper = shallow(<UsageReport {...props} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should not render with no usage on a new account', () => {
    props.usage.month.used = 0;
    props.accountAgeInWeeks = 1;
    const wrapper = shallow(<UsageReport {...props} />);
    expect(wrapper.html()).toBe(null);
  });
});
