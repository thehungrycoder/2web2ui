import { shallow } from 'enzyme';
import React from 'react';
import { CreatePage } from '../CreatePage';

describe('A/B Test Create Page', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      createAbTestDraft: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      history: {
        push: jest.fn()
      },
      loading: false,
      listTemplates: jest.fn()
    };

    wrapper = shallow(<CreatePage {...props} />);
  });

  it('should render the list page correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should get templates on mount', () => {
    expect(props.listTemplates).toHaveBeenCalled();
  });

  it('should show loading component when data is loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show an alert on successful A/B test creation', async () => {
    await wrapper.instance().create({ id: 'woooooooow', subaccount: { id: 1 }, default_variant: { id: 'ok' }});
    expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'A/B test created'
    });
    expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/ab-testing/woooooooow/1?subaccount=1');
  });

  it('should show an alert on successful A/B test creation (no subaccounts)', async () => {
    await wrapper.instance().create({ id: 'woooooooow' });
    expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
      type: 'success',
      message: 'A/B test created'
    });
    expect(wrapper.instance().props.history.push).toHaveBeenCalledWith('/ab-testing/woooooooow/1');
  });
});
