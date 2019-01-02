import React from 'react';
import { shallow } from 'enzyme';
import FacetDataCell from '../FacetDataCell';

describe('FacetDataCell', () => {
  const subject = (props = {}) => shallow(
    <FacetDataCell
      facet={{ key: 'sending_domain' }}
      sending_domain="example.com"
      signalOptions={{}}
      subaccounts={{}}
      {...props}
    />
  );

  it('renders data cell with a page link', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders data cell with a page link and subaccount search', () => {
    const props = {
      signalOptions: {
        subaccount: {
          id: 123
        }
      }
    };

    expect(subject(props)).toMatchSnapshot();
  });

  it('renders label and id', () => {
    const props = {
      facet: {
        isDefault: true,
        key: 'subaccount_id'
      },
      subaccounts: {
        123: {
          name: 'Test Subaccount'
        }
      },
      subaccount_id: 123
    };

    expect(subject(props)).toMatchSnapshot();
  });

  it('renders only id', () => {
    const props = {
      facet: {
        isDefault: true,
        key: 'subaccount_id'
      },
      subaccount_id: 123
    };

    expect(subject(props)).toMatchSnapshot();
  });
});
