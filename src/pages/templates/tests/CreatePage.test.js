import { shallow } from 'enzyme';
import React from 'react';

import CreatePage from '../CreatePage';

let wrapper;
let props;

describe('Template CreatePage', () => {
  beforeEach(() => {
    props = {
      id: null,
      cloneId: null,
      loading: false,
      template: {
        draft: {}
      },
      getDraft: jest.fn(() => Promise.resolve()),
      match: {
        params: {}
      },
      handleSubmit: jest.fn(),
      history: {
        push: jest.fn()
      },
      showAlert: jest.fn(),
      formName: 'templateCreate'
    };
  });

  describe('New Template', () => {
    beforeEach(() => {
      wrapper = shallow(<CreatePage {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render loading correctly', () => {
      wrapper.setProps({ loading: true });
      expect(wrapper.find('Loading')).toHaveLength(1);
    });

    it('should not call getDraft (load template)', () => {
      expect(props.getDraft).not.toHaveBeenCalled();
    });

    it('should handle create', async() => {
      const createSuccess = jest.fn((a) => Promise.resolve(a));
      wrapper.setProps({ id: 'id', create: createSuccess });
      await wrapper.instance().handleCreate('values');
      expect(createSuccess).toHaveBeenCalledWith('values');
      expect(props.history.push).toHaveBeenCalledWith('/templates/edit/id');
    });

    it('should handle create fail', async() => {
      const createFail = jest.fn((a) => Promise.reject({ message: 'fail' }));
      wrapper.setProps({ id: 'id', create: createFail });
      await wrapper.instance().handleCreate('values');
      expect(createFail).toHaveBeenCalledWith('values');
      expect(props.showAlert).toHaveBeenCalledWith({ details: 'fail', message: 'Could not create template', type: 'error' });
    });
  });

  describe('Duplicate Template', () => {
    beforeEach(() => {
      props.match.params.id = 100;
      props.cloneId = 101;
      wrapper = shallow(<CreatePage {...props} />);
    });

    it('should render correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should not call getDraft (load template)', () => {
      expect(props.getDraft).toHaveBeenCalled();
    });
  });
});
