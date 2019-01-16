import React from 'react';
import { shallow } from 'enzyme';
import { MessageEventsPage } from '../MessageEventsPage';
import { CursorPaging } from '../components/CursorPaging';

let wrapper;
let instance;

describe('Page: Message Events tests', () => {
  const props = {
    empty: false,
    error: null,
    loading: false,
    getMessageEvents: jest.fn(() => []),
    changePage: jest.fn(() => []),
    refreshReportOptions: jest.fn(),
    events: [
      {
        formattedDate: 'so-formatted',
        type: 'delivery',
        friendly_from: 'hi@friendly',
        rcpt_to: 'ron.swanson@pawnee.state.in.us'
      },
      {
        formattedDate: 'formatted',
        type: 'injection',
        friendly_from: 'mean@friendly',
        rcpt_to: 'tom.haverford@pawnee.state.in.us'
      }
    ],
    history: {
      push: jest.fn()
    },
    search: {
      dateOptions: {},
      recipients: []
    },
    linkByPage: ['cursor=foo', 'cursor=bar', 'cursor=foobar', null],
    cachedResultsByPage: [[]],
    hasMorePagesAvailable: true
  };

  beforeEach(() => {
    wrapper = shallow(<MessageEventsPage {...props} />);
    instance = wrapper.instance();
    wrapper.setState({
      currentPage: 2,
      perPage: 25
    });
  });

  it('should render page correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('refreshes on change in search filters', () => {
    const search = { ...props.search, changed: 'something' };
    wrapper.setProps({ search });
    expect(props.getMessageEvents).toHaveBeenCalledWith({ ...search, perPage: wrapper.state().perPage });
  });

  it('does not refresh if search has not changed', () => {
    wrapper.setProps({ search: props.search, changed: 'something else' });
    expect(props.getMessageEvents).not.toHaveBeenCalled();
  });

  it('should render error when action fails', () => {
    wrapper.setProps({ error: { message: 'You done f\'ed up now' }});
    expect(wrapper).toMatchSnapshot();
    wrapper.find('ApiErrorBanner').props().reload();
    expect(wrapper.instance().props.getMessageEvents).toHaveBeenCalledWith({
      dateOptions: {},
      recipients: []
    });
  });

  it('should correctly disable previous button', () => {
    wrapper.setState({ currentPage: 1 });
    expect(wrapper.find(CursorPaging).prop('previousDisabled')).toEqual(true);
  });

  it('should correctly disable next button', () => {
    wrapper.setProps({ hasMorePagesAvailable: false });
    expect(wrapper.find(CursorPaging).prop('nextDisabled')).toEqual(true);
  });

  it('should correctly handle changing per page', () => {
    const perPage = 100;
    const { getMessageEvents, search } = props;
    instance.handlePerPageChange(perPage);
    expect(getMessageEvents).toHaveBeenCalledWith({ ...search, perPage });
  });

  it('should correctly handle changing page', () => {
    const { changePage } = props;
    const pageNumber = 1;
    instance.handlePageChange(pageNumber);
    expect(changePage).toHaveBeenCalledWith(pageNumber);
  });

  it('should correctly handle first page reload', () => {
    const { getMessageEvents, search } = props;
    instance.handleFirstPage();
    const { perPage } = wrapper.state();
    expect(getMessageEvents).toHaveBeenCalledWith({ ...search, perPage });
  });

  it('should only render loading component while loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render the empty message when 0 results are returned', () => {
    wrapper.setProps({ empty: true });
    expect(wrapper).toMatchSnapshot();
  });

  describe('getRowData', () => {
    let event;
    beforeEach(() => {
      event = {
        formattedDate: 'formatted',
        type: 'injection',
        friendly_from: 'mean@friendly',
        rcpt_to: 'tom.haverford@pawnee.state.in.us',
        message_id: '123abc',
        event_id: '456xyz'
      };
    });

    it('renders correctly', () => {
      expect(instance.getRowData(event)).toMatchSnapshot();
    });

  });
});
