import React from 'react';
import { shallow } from 'enzyme';

import { DetailsPage } from '../DetailsPage';

describe('DetailsPage', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      id: '123',
      loading: false,
      subaccount: {
        id: '123',
        name: 'Bob Evans, the restaurant.'
      },
      location: {
        pathname: '/account/subaccounts/123'
      },
      clearSubaccount: jest.fn(),
      getSubaccount: jest.fn(),
      hideNewApiKey: jest.fn(),
      listApiKeys: jest.fn(),
      listDomains: jest.fn(),
      listPools: jest.fn()
    };

    wrapper = shallow(<DetailsPage {...props} />);
  });

  it('should render edit tab', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading page', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should redirect and alert on error', () => {
    wrapper.setProps({ error: new Error('Oh no!') });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show api key banner with new api key', () => {
    wrapper.setProps({ newKey: 'my-key' });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render api keys tab', () => {
    wrapper.setProps({
      location: {
        pathname: '/account/subaccounts/123/api-keys'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should select sending domains tab', () => {
    wrapper.setProps({
      location: {
        pathname: '/account/subaccounts/123/sending-domains'
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it('should request data on mount', () => {
    expect(props.getSubaccount).toHaveBeenCalledWith('123');
    expect(props.listApiKeys).toHaveBeenCalledTimes(1);
    expect(props.listDomains).toHaveBeenCalledTimes(1);
    expect(props.listPools).toHaveBeenCalledTimes(1);
  });

  it('should clear new api key on unmount', () => {
    wrapper.unmount();
    expect(props.hideNewApiKey).toHaveBeenCalledTimes(1);
  });

  it('should clear subaccount on unmount', () => {
    wrapper.unmount();
    expect(props.clearSubaccount).toHaveBeenCalledTimes(1);
  });
});
