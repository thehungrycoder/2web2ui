import { shallow } from 'enzyme';
import React from 'react';
import { ListPage } from '../ListPage';

describe('Page: A/B Test List', () => {
  const props = {
    listAbTests: jest.fn(),
    deleteAbTest: jest.fn(() => Promise.resolve()),
    cancelAbTest: jest.fn(() => Promise.resolve()),
    showAlert: jest.fn(),
    error: null,
    abTests: [
      {
        id: 'id-1',
        version: '1',
        name: 'my ab test 1',
        status: 'scheduled',
        default_template: {
          template_id: 'ab-test-1'
        },
        updated_at: '2018-10-21T10:10:10.000Z'
      },
      {
        id: 'id-2',
        version: '2',
        name: 'my ab test 2',
        status: 'running',
        default_template: {
          template_id: 'ab-test-2'
        },
        updated_at: '2018-10-22T10:10:10.000Z'
      },
      {
        id: 'id-3',
        version: '3',
        name: 'my ab test 3',
        status: 'completed',
        winning_template_id: 'ab-test-winner',
        default_template: {
          template_id: 'ab-test-3'
        },
        updated_at: '2018-10-23T10:10:10.000Z'
      }
    ],
    loading: false
  };

  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<ListPage {...props} />);
  });

  it('should render happy path', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render loading component when loading data', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render cancel modal', () => {
    wrapper.setState({ showCancelModal: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render delete modal', () => {
    wrapper.setState({ showDeleteModal: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render error when it fails', () => {
    wrapper.setProps({ error: { message: 'this failed' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should toggle cancel modal', () => {
    expect(wrapper).toHaveState('showCancelModal', false);
    expect(wrapper).toHaveState('testToCancel', {});
    wrapper.instance().toggleCancel('test-id', 101);
    expect(wrapper).toHaveState('showCancelModal', true);
    expect(wrapper).toHaveState('testToCancel', { id: 'test-id', subaccountId: 101 });
  });

  it('should toggle delete modal', () => {
    expect(wrapper).toHaveState('showDeleteModal', false);
    expect(wrapper).toHaveState('testToDelete', {});
    wrapper.instance().toggleDelete('test-id', 101);
    expect(wrapper).toHaveState('showDeleteModal', true);
    expect(wrapper).toHaveState('testToDelete', { id: 'test-id', subaccountId: 101 });
  });

  it('should handle cancel', () => {
    wrapper.setState({ 'testToCancel': { id: 'ab-test', subaccountId: 202 }});
    wrapper.instance().handleCancel().then(() => {
      expect(props.cancelAbTest).toHaveBeenCalledWith({ id: 'ab-test', subaccountId: 202 });
      expect(props.showAlert).toHaveBeenCalled();
    });
  });

  it('should handle delete', () => {
    wrapper.setState({ 'testToDelete': { id: 'ab-test', subaccountId: 202 }});
    wrapper.instance().handleDelete().then(() => {
      expect(props.deleteAbTest).toHaveBeenCalledWith({ id: 'ab-test', subaccountId: 202 });
      expect(props.showAlert).toHaveBeenCalled();
    });
  });
});
