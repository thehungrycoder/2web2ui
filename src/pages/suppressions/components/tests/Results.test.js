import { shallow } from 'enzyme';
import React from 'react';

import { Results } from '../Results';
import Detail from '../Detail';
import { DeleteModal } from 'src/components';

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
      data: null
    },
    del: {
      open: false,
      data: null
    }
  };

  results = [
    { recipient: 'rec1@dom.com', type: 'transactional', source: 'Manually added' },
    { recipient: 'rec2@dom.com', type: 'non_transactional', source: 'Manually added', subaccount_id: 101 }
  ];

  wrapper = shallow(<Results {...props} />);
  instance = wrapper.instance();
});

describe('Results', () => {
  it('renders correctly on initial loading', () => {
    wrapper.setProps({ results: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly when list is loading', () => {
    wrapper.setProps({ loading: true });
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

  it('renders detail modal correctly', () => {
    wrapper.setProps({ results, hasSubaccounts: true });
    wrapper.setState({ detail: { open: false, data: {}}});
    expect(wrapper).toMatchSnapshot();
  });

  it('toggles the detail modal on cancel', () => {
    const toggleFn = jest.spyOn(instance, 'toggleDetailModal');
    wrapper.setProps({ results, hasSubaccounts: true });
    wrapper.find(Detail).at(0).simulate('cancel');
    expect(toggleFn).toHaveBeenCalled();
    toggleFn.mockRestore();
  });

  it('renders delete confirmation modal correctly', () => {
    wrapper.setProps({ results });
    wrapper.setState({ del: { open: false, data: {}}});
    expect(wrapper).toMatchSnapshot();
  });

  it('toggles the delete modal on cancel', () => {
    const toggleFn = jest.spyOn(instance, 'toggleDeleteModal').mockImplementation(() => {});
    wrapper.setProps({ results, hasSubaccounts: true });
    wrapper.find(DeleteModal).at(0).simulate('cancel');
    expect(toggleFn).toHaveBeenCalled();
    toggleFn.mockRestore();
  });


  describe('deleteSuppression', () => {
    it('deletes the recipient', async () => {
      const suppression = { recipient: 'foo@bar.com' };
      wrapper.setState({ del: { open: true, data: suppression }});
      instance.toggleDeleteModal = jest.fn();

      await instance.deleteSuppression();

      expect(props.deleteSuppression).toHaveBeenCalledTimes(1);
      expect(props.deleteSuppression).toHaveBeenCalledWith(suppression);
      expect(props.showAlert).toHaveBeenCalledTimes(1);
      expect(instance.toggleDeleteModal).toHaveBeenCalledTimes(1);
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
      expect(del.data).toEqual({});
    });
  });

  describe('getRowData', () => {
    it('renders row correctly', () => {
      const row = instance.getRowData(results[0]);
      expect(row).toMatchSnapshot();
    });

    it('renders row correctly with subaccounts', () => {
      wrapper.setProps({ hasSubaccounts: true });
      const row = instance.getRowData(results[1]);
      expect(row).toMatchSnapshot();
    });
  });

});
