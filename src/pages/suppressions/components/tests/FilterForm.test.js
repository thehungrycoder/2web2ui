import { shallow } from 'enzyme';
import React from 'react';
import moment from 'moment';
import * as dateHelpers from 'src/helpers/date';
import { FilterForm } from '../FilterForm';
jest.mock('src/helpers/date');

let props;
let wrapper;
let instance;

beforeEach(() => {
  props = {
    onSubmit: jest.fn(),
    list: null
  };
  wrapper = shallow(<FilterForm {...props} />);
  instance = wrapper.instance();
  dateHelpers.getRelativeDates = jest.fn();
});

describe('FilterForm', () => {
  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  describe('componentDidMount', () => {
    it('does not reload suppression if list is null', () => {
      expect(props.onSubmit).toHaveBeenCalledTimes(0);
    });

    it('reloads suppressions if list is empty', () => {
      expect(props.onSubmit).toHaveBeenCalledTimes(0);
      wrapper.setProps({ list: []});
      instance.componentDidMount();
      expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });

    it('does not reload suppression if list is non-empty', () => {
      wrapper.setProps({ list: [{ recipient: 'foo@bar.com' }]});
      instance.componentDidMount();
      expect(props.onSubmit).toHaveBeenCalledTimes(0);
    });
  });

  describe('componentDidUpdate', () => {
    it('does not reload suppression if new state is same as current', () => {
      const state = wrapper.state();
      instance.componentDidUpdate(null, state);
      expect(props.onSubmit).toHaveBeenCalledTimes(0);
    });

    it('reloads suppressions if new state is different', () => {
      const state = wrapper.state();
      instance.componentDidUpdate(null, { ...state, sources: ['foo', 'bar' ]});
      expect(wrapper.state()).toEqual(state);
      expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('refresh', () => {
    it('calls the onSubmit function with correct args', () => {
      const newState = { types: ['txn', 'non_txn'], sources: ['admin', 'policy']};
      wrapper.setState(newState);
      props.onSubmit.mockClear(); //get rid of usage by lifecycle method after setState

      instance.refresh();
      expect(props.onSubmit).toHaveBeenCalledWith(newState);
      expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleDateSelection', () => {
    let from;
    let to;
    beforeEach(() => {
      from = moment().toDate();
      to = moment().add(7, 'days').toDate();
      dateHelpers.getRelativeDates.mockReturnValue({ from, to });
    });

    it('sets state and refreshes correctly', () => {
      instance.handleDateSelection({ from, to });
      const state = wrapper.state();
      expect(state).toMatchObject({
        reportFilters: {
          from,
          to
        }
      });
    });

    it('converts relative date to actual from/to', () => {
      instance.handleDateSelection({ relativeRange: '7day' });
      const state = wrapper.state();
      expect(state).toMatchObject({
        reportFilters: {
          from,
          to,
          relativeRange: '7day'
        }
      });
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
