import { shallow } from 'enzyme';
import React from 'react';

import EditPage from '../EditPage';

describe('Template EditPage', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      template: {
        has_published: true
      },
      handleSubmit: jest.fn(),
      match: {
        params: { id: 'id' }
      },
      getDraft: jest.fn(() => Promise.resolve()),
      getTestData: jest.fn(),
      deleteTemplate: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      history: {
        push: jest.fn()
      },
      subaccountId: 101,
      formName: 'templateEdit',
      canModify: true
    };

    wrapper = shallow(<EditPage {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getTestData).toHaveBeenCalledWith({ id: 'id', mode: 'draft' });
    expect(props.getDraft).toHaveBeenCalledWith('id', props.subaccountId);
  });

  it('should render correctly for read-only users', () => {
    wrapper.setProps({ canModify: false });
    expect(wrapper).toMatchSnapshot();
  });

  it('should handle errors when getting template', () => {
    wrapper.setProps({ getDraftError: 'error' });
    expect(props.history.push).toHaveBeenCalledWith('/templates/');
  });

  it('should render loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find('Loading')).toHaveLength(1);
  });

  it('should not show View Published link if template is not published', () => {
    wrapper.setProps({ template: { has_published: false }});
    expect(wrapper.find('Page').props().secondaryActions[0].visible).toBe(false);
  });

  it('should handle modal toggle', () => {
    wrapper.setState({ deleteOpen: false });
    wrapper.instance().handleDeleteModalToggle();
    expect(wrapper).toHaveState('deleteOpen', true);
  });

  describe('publish', () => {
    it('should handle success', async () => {
      wrapper.setProps({ publish: jest.fn(() => Promise.resolve()) });
      await wrapper.instance().handlePublish('values');
      expect(props.history.push).toHaveBeenCalledWith('/templates/edit/id/published?subaccount=101');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Template published' });
    });
  });

  describe('save', () => {
    it('should handle success', async () => {
      wrapper.setProps({ update: jest.fn(() => Promise.resolve()) });
      await wrapper.instance().handleSave('values');
      expect(props.getDraft).toHaveBeenCalledWith('id', 101);
      expect(props.getTestData).toHaveBeenCalledWith({ id: 'id', mode: 'draft' });
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Template saved' });
    });
  });

  describe('delete', () => {
    it('should handle success', async () => {
      wrapper.setProps({ deleteTemplate: jest.fn(() => Promise.resolve()) });
      await wrapper.instance().handleDelete('id');
      expect(props.history.push).toHaveBeenCalledWith('/templates/');
      expect(props.showAlert).toHaveBeenCalledWith({ message: 'Template deleted' });
    });
  });
});
