import { shallow } from 'enzyme';
import React from 'react';
import { ListPage } from '../ListPage';

describe('ListPage', () => {

  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      listSubaccounts: jest.fn(() => Promise.resolve()),
      searchRecipient: jest.fn(() => Promise.resolve()),
      searchSuppressions: jest.fn(() => Promise.resolve())
    };

    wrapper = shallow(<ListPage {...props} />);
    instance = wrapper.instance();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
    expect(props.listSubaccounts).toHaveBeenCalledTimes(0);
  });

  it('renders correctly with subaccounts', () => {
    const newProps = { ...props, hasSubaccounts: true };
    wrapper = shallow(<ListPage {...newProps } />);
    expect(wrapper).toMatchSnapshot();
    expect(props.listSubaccounts).toHaveBeenCalledTimes(1);
  });

  it('renders filter by email tab correctly when selected', () => {
    wrapper.setState({ selectedTab: 1 });
    expect(wrapper).toMatchSnapshot();
  });

  describe('handleTabs', () => {
    it('changes selected tab correctly', () => {
      expect(wrapper.state().selectedTab).toEqual(0);
      instance.handleTabs(1);
      expect(wrapper.state().selectedTab).toEqual(1);
    });
  });
});
