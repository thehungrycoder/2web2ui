import { shallow } from 'enzyme';
import React from 'react';

import ShareWithSubaccounts from '../ShareWithSubaccounts';

describe('ShareWithSubaccounts component', () => {
  it('does not render for subaccount domains', () => {
    expect(shallow(<ShareWithSubaccounts
      domain={{ subaccount_id: 101, shared_with_subaccounts: false }}
      onChange={jest.fn()}
    />)).toMatchSnapshot();
  });

  it('renders correctly', () => {
    expect(shallow(<ShareWithSubaccounts
      domain={{ shared_with_subaccounts: false }}
      onChange={jest.fn()}
    />)).toMatchSnapshot();
  });

  it('renders subaccount sharing state', () => {
    expect(shallow(<ShareWithSubaccounts
      domain={{ shared_with_subaccounts: true }}
      onChange={jest.fn()}
    />)).toMatchSnapshot();
  });
});

