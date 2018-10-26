import { shallow } from 'enzyme';
import React from 'react';
import SnippetCollection from '../SnippetCollection';

describe('SnippetCollection Component', () => {
  const props = {
    snippets: [
      {
        id: 'id-1',
        name: 'my snippet 1',
        subaccount_id: 101,
        created_at: '2018-10-21T10:10:10.000Z'
      },
      {
        id: 'id-2',
        name: 'my snippet 2',
        updated_at: '2018-10-21T10:10:10.000Z',
        created_at: '2018-10-21T10:10:10.000Z'
      },
      {
        id: 'id-3',
        name: 'my snippet 3',
        shared_with_subaccounts: true,
        updated_at: '2018-10-21T10:10:10.000Z',
        created_at: '2018-10-21T10:10:10.000Z'
      }
    ],
    hasSubaccounts: true,
    toggleDelete: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SnippetCollection {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render subaccount column', () => {
    wrapper.setProps({ hasSubaccounts: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render subaccount column', () => {
    wrapper.setProps({ hasSubaccounts: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should toggleDelete', () => {
    const actionCol = shallow(wrapper.instance().getRowData(props.snippets[0]).pop());
    actionCol.find('ActionPopover').prop('actions')[1].onClick();
    expect(props.toggleDelete).toHaveBeenCalledWith('id-1', 101);
  });
});
