import { shallow } from 'enzyme';
import React from 'react';
import { SuppressionSearch } from '../SuppressionSearch';

let props;
let wrapper;
let instance;

beforeEach(() => {
  props = {
    onSubmit: jest.fn(),
    refreshReportOptions: jest.fn(),
    reportOptions: {},
    list: null
  };
  wrapper = shallow(<SuppressionSearch {...props} />);
  instance = wrapper.instance();
});

describe('SuppressionSearch', () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should refresh report options on mount', () => {
    expect(props.refreshReportOptions).toHaveBeenCalledTimes(1);
  });

  describe('componentDidUpdate', () => {
    it('does not reload suppression if new state is same as current', () => {
      wrapper.setProps({ newProp: true });
      expect(props.onSubmit).toHaveBeenCalledTimes(0);
    });

    it('reloads suppressions if new state is different', () => {
      wrapper.setState({ newState: true });
      expect(props.onSubmit).toHaveBeenCalledWith({ ...wrapper.state(), reportOptions: props.reportOptions });
    });

    it('reloads suppressions if reportOptions reference changes', () => {
      const reportOptions = { is: 'new!' };
      wrapper.setProps({ reportOptions });
      expect(props.onSubmit).toHaveBeenCalledWith({ ...wrapper.state(), reportOptions });
    });
  });

  describe('handleTypesSelection', () => {
    let types;
    beforeEach(() => {
      types = { transactional: true, non_transactional: false };
    });

    it('update states with correct types (single)', () => {
      instance.handleTypesSelection(types);
      expect(wrapper.state().types).toEqual(['transactional']);
    });

    it('update states with correct types (multiple)', () => {
      types.non_transactional = true;
      instance.handleTypesSelection(types);
      expect(wrapper.state().types).toEqual(['transactional', 'non_transactional']);

    });

    it('does not update if selected type is not changed', () => {
      /** this test may look confusing/noop. the goal is to test when setState method is not called
       * when selected types is same as that's already in state.
       * it would be good to be able to test if setState is invoked but I can't get that working
      */
      wrapper.setState({ types: ['transactional']});
      instance.handleTypesSelection(types);
      expect(wrapper.state().types).toEqual(['transactional']);
    });
  });

  describe('handleSourcesSelection', () => {
    let sources;
    beforeEach(() => {
      sources = { 'Spam Complaint': true, 'List Unsubscribe': false };
    });

    it('update states with correct source (single)', () => {
      instance.handleSourcesSelection(sources);
      expect(wrapper.state().sources).toEqual(['Spam Complaint']);
    });

    it('update states with correct sources (multiple)', () => {
      sources['List Unsubscribe'] = true;
      instance.handleSourcesSelection(sources);
      expect(wrapper.state().sources).toEqual(['Spam Complaint', 'List Unsubscribe']);

    });

    it('does not update if selected source is not changed', () => {
      /** this test may look confusing/noop. the goal is to test when setState method is not called
       * when selected types is same as that's already in state.
       * it would be good to be able to test if setState is invoked but I can't get that working
      */
      wrapper.setState({ sources: ['Spam Complaint']});
      instance.handleSourcesSelection(sources);
      expect(wrapper.state().sources).toEqual(['Spam Complaint']);
    });
  });
});
