import { shallow } from 'enzyme';
import React from 'react';

import { ListPage } from '../ListPage';

let props;

let wrapper;

beforeEach(() => {
  props = {
    listSubaccounts: jest.fn(() => Promise.resolve()),
    searchRecipient: jest.fn(() => Promise.resolve()),
    listSuppressions: jest.fn(() => Promise.resolve())
  };
});

describe('ListPage', () => {
  it('renders correctly', () => {
    wrapper = shallow(<ListPage {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(props.listSubaccounts).toHaveBeenCalledTimes(0);
  });

  it('renders correctly with subaccounts', () => {
    props.hasSubaccounts = true;
    wrapper = shallow(<ListPage {...props} />);
    expect(wrapper).toMatchSnapshot();
    expect(props.listSubaccounts).toHaveBeenCalledTimes(1);
  });

  describe('handleSearchByEmail', () => {
    let instance;
    beforeEach(() => {
      wrapper = shallow(<ListPage {...props} />);
      instance = wrapper.instance();
    });
    it('calls searchRecipients with options', () => {
      instance.handleSearchByEmail({ foo: 'bar' });
      expect(props.searchRecipient).toHaveBeenCalledWith({ foo: 'bar' });
    });
  });
});
