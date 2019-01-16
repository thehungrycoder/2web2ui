import { shallow } from 'enzyme';
import React from 'react';
import { OverviewPage } from '../OverviewPage';

describe('Signals Overview Page', () => {
  const subject = (props = {}) => shallow(
    <OverviewPage getSubaccounts={() => {}} {...props} />
  );

  it('renders page', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('calls getSubaccounts on mount', () => {
    const getSubaccounts = jest.fn();
    subject({ getSubaccounts });
    expect(getSubaccounts).toHaveBeenCalled();
  });
});
