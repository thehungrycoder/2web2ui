import { shallow } from 'enzyme';
import React from 'react';
import { DetailsPage } from '../DetailsPage';
import EditMode from '../EditMode';
import ViewMode from '../ViewMode';

describe('Page: A/B Test Details', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      error: null,
      id: 'id-1',
      version: '1',
      subaccountId: '101',
      test: {
        id: 'id-1',
        version: '1',
        name: 'my ab test 1',
        status: 'draft',
        default_template: {
          template_id: 'ab-test-1'
        },
        updated_at: '2018-10-21T10:10:10.000Z'
      },
      loading: false,
      showAlert: jest.fn(),
      getAbTest: jest.fn(),
      cancelAbTest: jest.fn(() => Promise.resolve()),
      deleteAbTest: jest.fn(() => Promise.resolve()),
      history: { push: jest.fn() }
    };
    wrapper = shallow(<DetailsPage {...props} />);
  });

  it('should render correctly and create shared props', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render edit mode in draft or scheduled', () => {
    expect(wrapper.find(EditMode)).toExist();
    wrapper.setProps({ test: { ...props.test, status: 'scheduled' }});
    expect(wrapper.find(EditMode)).toExist();
  });

  it('should render view mode in running, cancelled, or completed', () => {
    wrapper.setProps({ test: { ...props.test, status: 'running' }});
    expect(wrapper.find(ViewMode)).toExist();
    wrapper.setProps({ test: { ...props.test, status: 'cancelled' }});
    expect(wrapper.find(ViewMode)).toExist();
    wrapper.setProps({ test: { ...props.test, status: 'completed' }});
    expect(wrapper.find(ViewMode)).toExist();
  });

  it('should get A/B test on mount', () => {
    expect(props.getAbTest).toHaveBeenCalledWith({ id: props.id, version: props.version, subaccountId: props.subaccountId });
  });

  it('should render loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render error', () => {
    wrapper.setProps({ error: { message: 'an error' }, test: {}});
    expect(wrapper).toMatchSnapshot();
  });

  it('should toggle cancel modal', () => {
    expect(wrapper.instance().state.showCancelModal).toEqual(false);
    wrapper.instance().toggleCancel();
    expect(wrapper.instance().state.showCancelModal).toEqual(true);
  });

  it('should toggle delete modal', () => {
    expect(wrapper.instance().state.showDeleteModal).toEqual(false);
    wrapper.instance().toggleDelete();
    expect(wrapper.instance().state.showDeleteModal).toEqual(true);
  });

  it('should handle cancel', () => {
    wrapper.setProps({ 'test': { id: 'ab-test' }});
    return wrapper.instance().handleCancel().then(() => {
      expect(props.cancelAbTest).toHaveBeenCalledWith({ id: 'ab-test', subaccountId: '101' });
      expect(props.showAlert).toHaveBeenCalled();
      expect(props.getAbTest).toHaveBeenCalledWith({ id: props.id, version: props.version, subaccountId: props.subaccountId });
    });
  });

  it('should handle delete', () => {
    wrapper.setProps({ 'test': { id: 'ab-test' }});
    return wrapper.instance().handleDelete().then(() => {
      expect(props.deleteAbTest).toHaveBeenCalledWith({ id: 'ab-test', subaccountId: '101' });
      expect(props.showAlert).toHaveBeenCalled();
      expect(props.history.push).toHaveBeenCalled();
    });
  });

  it('should get a new version when url changes', () => {
    wrapper.setProps({ version: 3 });
    expect(props.getAbTest).toHaveBeenCalledWith({ id: 'id-1', subaccountId: '101', version: 3 });
  });
});
