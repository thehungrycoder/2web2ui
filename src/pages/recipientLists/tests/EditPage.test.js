import React from 'react';
import { shallow } from 'enzyme';

import { EditPage } from '../EditPage';

describe('EditPage', () => {
  let props;
  let id;
  let wrapper;

  beforeEach(() => {
    id = 'fave-recipients';
    props = {
      match: { params: { id }},
      list: [{
        id,
        name: 'Favorites',
        description: 'The creme de la creme',
        num_accepted_recipients: 23
      }],
      loading: false,
      current: id,
      listRecipientLists: jest.fn(() => Promise.resolve()),
      setCurrentRecipientList: jest.fn(),
      updateRecipientList: jest.fn(() => Promise.resolve()),
      deleteRecipientList: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      history: {
        push: jest.fn()
      }
    };
    wrapper = shallow(<EditPage {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should not preload recipient lists if not required', () => {
    expect(shallow(<EditPage {...props} />)).toMatchSnapshot();
    expect(props.listRecipientLists).not.toHaveBeenCalled();
  });

  it('should preload recipient lists if required', () => {
    const propsNoList = {
      ...props,
      list: [],
      loading: true // not strictly correct - listRecipientLists sets that then makes its API call
    };

    const wrapper = shallow(<EditPage {...propsNoList} />);
    expect(wrapper).toMatchSnapshot();
    expect(props.listRecipientLists).toHaveBeenCalled();
  });

  //  it('should handle a missing list id');

  it('should show a delete modal', () => {
    wrapper.instance().toggleDelete();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should delete a recipient list', async() => {
    await wrapper.instance().deleteRecipientList();
    expect(props.deleteRecipientList).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should redirect after delete', async() => {
    await wrapper.instance().deleteRecipientList();
    expect(props.history.push).toHaveBeenCalled();
  });

  it('should show errors while deleting', async() => {
    props.deleteRecipientList.mockImplementationOnce(() => Promise.reject());
    await wrapper.instance().deleteRecipientList();
    expect(props.showAlert).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
  });

  it('should update a recipient list', async() => {
    await wrapper.instance().updateRecipientList();
    expect(props.updateRecipientList).toHaveBeenCalled();
    expect(wrapper).toMatchSnapshot();
  });

  it('should show errors while updating', async() => {
    props.updateRecipientList.mockImplementationOnce(() => Promise.reject());
    await wrapper.instance().updateRecipientList();
    expect(props.showAlert).toHaveBeenCalledWith(expect.objectContaining({ type: 'error' }));
  });

  it('should redirect after update', async() => {
    await wrapper.instance().updateRecipientList();
    expect(props.history.push).toHaveBeenCalled();
  });
});

