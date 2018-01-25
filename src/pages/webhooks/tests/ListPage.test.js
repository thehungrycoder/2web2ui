import { shallow } from 'enzyme';
import React from 'react';
import { renderRowData } from 'src/__testHelpers__';

import { WebhooksList, getRowData } from '../ListPage';

describe('Page: Webhook List', () => {
  const props = {
    listWebhooks: jest.fn(),
    error: null,
    webhooks: [
      {
        id: 'id',
        name: 'my webby hook',
        target: 'go here'
      },
      {
        id: 'id-2',
        name: 'my webby hooki 2',
        target: 'go there'
      }
    ],
    loading: false
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<WebhooksList {...props} />);
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
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
    const row = getRowData(props.webhooks[0]);
    expect(renderRowData(row)).toMatchSnapshot();
  });
});

