import { shallow } from 'enzyme';
import React from 'react';
import { WebhooksList } from '../ListPage';

describe('Page: Webhook List', () => {
  const props = {
    listWebhooks: jest.fn(),
    error: null,
    webhooks: [
      {
        id: 'id',
        name: 'my webby hook',
        target: 'go here',
        subaccount_id: 0,
        last_successful: '2018-02-08T15:20:25Z',
        last_failure: '2018-01-08T15:20:25Z'
      },
      {
        id: 'id-2',
        name: 'my webby hooki 2',
        target: 'go there',
        subaccount_id: 101,
        last_successful: '2018-02-08T15:20:25Z'
      },
      {
        id: 'id-3',
        name: 'my webby hooki 3',
        target: 'go nowhere',
        last_failure: '2018-01-08T15:20:25Z'
      }
    ],
    loading: false,
    showAlert: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<WebhooksList {...props} />);
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with subaccounts', () => {
    wrapper.setProps({ hasSubaccounts: true });
    expect(wrapper.find('TableCollection').props().columns).toMatchSnapshot();
    const rows = props.webhooks.map(wrapper.instance().getRowData);
    expect(rows).toMatchSnapshot();
  });

  it('should render loading component when loading data', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render error when it fails', () => {
    wrapper.setProps({ error: { message: 'this hook failed' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render row data properly', () => {
    const row = wrapper.instance().getRowData(props.webhooks[0]);
    expect(row).toMatchSnapshot();
  });
});
