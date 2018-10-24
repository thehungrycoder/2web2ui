import { shallow } from 'enzyme';
import React from 'react';
import { SnippetCollection } from '../SnippetCollection';

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
    toggleDelete: jest.fn()
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<SnippetCollection {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render row data properly', () => {
    const row1 = wrapper.instance().getRowData(props.snippets[0]);
    expect(row1).toMatchSnapshot();
    const row2 = wrapper.instance().getRowData(props.snippets[1]);
    expect(row2).toMatchSnapshot();
    const row3 = wrapper.instance().getRowData(props.snippets[2]);
    expect(row3).toMatchSnapshot();
  });

  it('should toggleDelete', () => {
    const actionCol = shallow(wrapper.instance().getRowData(props.snippets[0]).pop());
    actionCol.find('ActionPopover').prop('actions')[1].onClick();
    expect(props.toggleDelete).toHaveBeenCalledWith('id-1', 101);
  });
});
