import { shallow } from 'enzyme';
import React from 'react';
import { EditPage } from '../EditPage';

describe('IP Pools Edit Page', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      match: {
        params: {
          id: 'my-pool'
        }
      },
      error: null,
      pool: {
        name: 'My Pool',
        id: 'my-pool'
      },
      updatePool: jest.fn(() => Promise.resolve()),
      updateSendingIp: jest.fn(() => Promise.resolve()),
      deletePool: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      history: {
        push: jest.fn()
      },
      loading: false,
      listPools: jest.fn(),
      listError: null,
      getError: null,
      getPool: jest.fn()
    };

    wrapper = shallow(<EditPage {...props} />);
  });

  describe('render tests', () => {
    it('should render the edit page correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should show loading panel when data is loading', () => {
      wrapper.setProps({ loading: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('should list pools and get pool when calling loadDependentData', () => {
      const component = wrapper.instance();
      component.loadDependentData();
      expect(component.props.listPools).toHaveBeenCalled();
      expect(component.props.getPool).toHaveBeenCalledWith('my-pool');
    });
  });

  describe('renderForm tests', () => {
    it('should show list error msg on error', () => {
      wrapper.setProps({ error: true, listError: { message: 'failed listing pools' }});
      expect(wrapper).toMatchSnapshot();
    });

    it('should show get error msg on error', () => {
      wrapper.setProps({ error: true, getError: { message: 'failed getting pools' }});
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('onUpdatePool tests', () => {
    let updatePoolSpy;

    beforeEach(() => {
      updatePoolSpy = jest.spyOn(wrapper.instance().props, 'updatePool');
    });

    it('should show an alert on successful pool update', async() => {
      await wrapper.instance().onUpdatePool({ name: 'my_pool', '127_0_0_1': 'other_pool', '127_0_0_2': 'my-pool' });
      expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Updated IP pool my-pool.'
      });
      expect(updatePoolSpy).toHaveBeenCalled();
      expect(wrapper.instance().props.history.push).toHaveBeenCalled();

    });

    it('should not update pool if editing default pool', async() => {
      wrapper.setProps({ match: { params: { id: 'default' }}});
      await wrapper.instance().onUpdatePool({ name: 'default', '127_0_0_1': 'other_pool', '127_0_0_2': 'default' });
      expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Updated IP pool default.'
      });
      expect(updatePoolSpy).not.toHaveBeenCalled();
      expect(wrapper.instance().props.history.push).toHaveBeenCalled();
    });
  });

  describe('delete modal tests', () => {
    it('should toggle delete modal on cancel', () => {
      const stateSpy = jest.spyOn(wrapper.instance(), 'setState');
      wrapper.instance().toggleDelete();
      expect(stateSpy).toHaveBeenCalledWith({ showDelete: true });
    });

    it('should show alert on delete pool', async() => {
      await wrapper.instance().onDeletePool();
      expect(wrapper.instance().props.showAlert).toHaveBeenCalledWith({
        type: 'success',
        message: 'Deleted IP pool my-pool.'
      });
      expect(wrapper.instance().props.history.push).toHaveBeenCalled();
    });
  });
});
