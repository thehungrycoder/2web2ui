import { shallow } from 'enzyme';
import React from 'react';

import { EditPage } from '../EditPage';

describe('Template EditPage', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      template: {
        published: true
      },
      handleSubmit: jest.fn(),
      match: {
        params: { id: 'id' }
      },
      getDraft: jest.fn(() => Promise.resolve()),
      getPublished: jest.fn(() => Promise.resolve()),
      getTestData: jest.fn(),
      deleteTemplate: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      history: {
        push: jest.fn()
      }
    };

    wrapper = shallow(<EditPage {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.getTestData).toHaveBeenCalledWith({ id: 'id', mode: 'draft' });
    expect(props.getDraft).toHaveBeenCalledWith('id');
    expect(props.getPublished).toHaveBeenCalledWith('id');
  });

  it('should render loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find('Loading')).toHaveLength(1);
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
      expect(props.history.push).toHaveBeenCalledWith('/templates/edit/id/published');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Template published' });
    });

    it('should handle fail', async () => {
      wrapper.setProps({ publish: jest.fn(() => Promise.reject({ message: 'fail' })) });
      await wrapper.instance().handlePublish('values');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Could not publish template', details: 'fail' });
    });
  });

  describe('save', () => {
    it('should handle success', async () => {
      wrapper.setProps({ update: jest.fn(() => Promise.resolve()) });
      await wrapper.instance().handleSave('values');
      expect(props.getDraft).toHaveBeenCalledWith('id');
      expect(props.getTestData).toHaveBeenCalledWith({ id: 'id', mode: 'draft' });
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'success', message: 'Template saved' });
    });

    it('should handle fail', async () => {
      wrapper.setProps({ update: jest.fn(() => Promise.reject({ message: 'fail' })) });
      await wrapper.instance().handleSave('values');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Could not save template', details: 'fail' });
    });
  });

  describe('delete', () => {
    it('should handle success', async () => {
      wrapper.setProps({ deleteTemplate: jest.fn(() => Promise.resolve()) });
      await wrapper.instance().handleDelete('id');
      expect(props.history.push).toHaveBeenCalledWith('/templates/');
      expect(props.showAlert).toHaveBeenCalledWith({ message: 'Template deleted' });
    });

    it('should handle fail', async () => {
      wrapper.setProps({ deleteTemplate: jest.fn(() => Promise.reject({ message: 'fail' })) });
      await wrapper.instance().handleDelete('id');
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'Could not delete template', details: 'fail' });
    });
  });
});
