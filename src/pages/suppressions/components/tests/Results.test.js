import { shallow } from 'enzyme';
import React from 'react';

import { Results } from '../Results';

let props;
let wrapper;
let results = [];
let instance;

beforeEach(() => {
  props = {
    deleteSuppression: jest.fn(() => Promise.resolve()),
    showAlert: jest.fn(() => Promise.resolve()),
    detail: {
      open: false,
      data: {}
    },
    del: {
      open: false,
      data: {}
    }
  };

  results = [
    { recipient: 'rec1@dom.com', type: 'Transactional', source: 'Manually added' },
    { recipient: 'rec2@dom.com', type: 'Non-transactional', source: 'Manually added', subaccount_id: 101 }
  ];

  wrapper = shallow(<Results {...props} />);
  instance = wrapper.instance();
});

describe('Results', () => {
  it('renders correctly on initial loading', () => {
    wrapper.setProps({ results: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly (empty suppressions)', () => {
    wrapper.setProps({ results: []});
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly (with suppressions)', () => {
    wrapper.setProps({ results });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly (with suppressions, with subaccount)', () => {
    wrapper.setProps({ results, hasSubaccounts: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('deleteRecipient', () => {
    it('deletes the recipient', async() => {
      const suppression = { recipient: 'foo@bar.com' };
      wrapper.setState({ del: { open: true, data: suppression }});
      instance.toggleDeleteModal = jest.fn();

      await instance.deleteRecipient();

      expect(props.deleteSuppression).toHaveBeenCalledTimes(1);
      expect(props.deleteSuppression).toHaveBeenCalledWith(suppression);
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(instance.toggleDeleteModal).toHaveBeenCalledTimes(1);
    });

    it('does not hide modal on error', async() => {
      const err = new Error('that error!');
      instance.toggleDeleteModal = jest.fn();
      props.deleteSuppression.mockReturnValue(Promise.reject(err));

      await instance.deleteRecipient();

      expect(props.deleteSuppression).toHaveBeenCalledTimes(1);
      expect(props.showAlert).toHaveBeenCalledWith({ type: 'error', message: 'that error!' });
      expect(instance.toggleDeleteModal).toHaveBeenCalledTimes(0);
    });
  });

  describe('toggleDetailModal', () => {
    it('sets state correctly', () => {
      let detail;
      const recipient = { recipient: 'foo@bar.com' };
      instance.toggleDetailModal(recipient);
      detail = wrapper.state().detail;
      expect(detail.open).toBe(true);
      expect(detail.data).toEqual(recipient);

      instance.toggleDetailModal();
      detail = wrapper.state().detail;
      expect(detail.open).toBe(false);
      expect(detail.data).toEqual(undefined);

    });
  });

  describe('toggleDeleteModal', () => {
    it('sets state correctly', () => {
      let del;
      const recipient = { recipient: 'foo@bar.com' };
      instance.toggleDeleteModal(recipient);
      del = wrapper.state().del;
      expect(del.open).toBe(true);
      expect(del.data).toEqual(recipient);

      instance.toggleDeleteModal();
      del = wrapper.state().del;
      expect(del.open).toBe(false);
      expect(del.data).toEqual(undefined);
    });
  });

});
