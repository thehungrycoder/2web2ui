import React from 'react';
import { shallow } from 'enzyme';
import FacetDataCell from '../FacetDataCell';

describe('FacetDataCell', () => {
  const subject = (props = {}) => shallow(
    <FacetDataCell
      dimension="example"
      facet="domain"
      id="example.com"
      signalOptions={{}}
      {...props}
    />
  );

  it('renders page link', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders page link for master account', () => {
    expect(subject({ facet: 'sid', id: 0 })).toMatchSnapshot();
  });

  it('renders page link with subaccount search', () => {
    const props = {
      signalOptions: {
        subaccount: {
          id: 123
        }
      }
    };

    expect(subject(props)).toMatchSnapshot();
  });

  it('renders page link with name and id', () => {
    const props = {
      facet: 'sid',
      id: 123,
      name: 'Test Subaccount'
    };

    expect(subject(props)).toMatchSnapshot();
  });
});
