import React from 'react';
import { shallow } from 'enzyme';
import SummaryTable from 'src/components/summaryTable';
import SpamTrapOverview from '../SpamTrapOverview';

describe('SpamTrapOverview', () => {
  const subject = (props = {}) => shallow(
    <SpamTrapOverview
      data={[
        {
          current_trap_hits: 12,
          current_relative_trap_hits: 5,
          domain: 'example.com',
          history: [
            { date: '2018-01-13', relative_trap_hits: 5, trap_hits: 12 }
          ]
        }
      ]}
      facet={{
        key: 'domain',
        label: 'Domain',
        sortable: false
      }}
      getSpamHits={() => {}}
      getSubaccounts={() => {}}
      loading={false}
      signalOptions={{
        facet: 'domain',
        facetSearchTerm: 'example.com',
        relativeRange: '14days',
        subaccount: {
          id: 123
        }
      }}
      subaccounts={{
        123: { id: 123, name: 'Test Subaccount' }
      }}
      summaryTable={{
        currentPage: 1,
        order: { ascending: true, dataKey: 'domain' },
        perPage: 10
      }}
      tableName="Test"
      totalCount={1}
      {...props}
    />
  );

  it('renders overview panel with controls and table', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders empty summary table', () => {
    const wrapper = subject({ data: []});
    expect(wrapper.find(SummaryTable).prop('empty')).toEqual(true);
  });

  it('renders error message', () => {
    const wrapper = subject({
      data: [],
      error: new Error('Oh no!')
    });

    expect(wrapper.find(SummaryTable).prop('error')).toEqual('Oh no!');
  });

  it('renders loader', () => {
    const wrapper = subject({
      data: [],
      loading: true
    });

    expect(wrapper.find(SummaryTable).prop('loading')).toEqual(true);
  });

  it('handles calculation change', () => {
    const wrapper = subject();
    wrapper.find('Calculation').simulate('change', 'absolute');
    expect(wrapper.state('calculation')).toEqual('absolute');
  });

  it('handles chart type change', () => {
    const wrapper = subject();
    wrapper.find('ChartType').simulate('change', 'bar');
    expect(wrapper.state('chartType')).toEqual('bar');
  });

  it('requests data on mount', () => {
    const getSpamHits = jest.fn();
    subject({ getSpamHits });

    expect(getSpamHits).toHaveBeenCalledWith({
      facet: 'domain',
      filter: 'example.com',
      limit: 10,
      offset: 0,
      order: 'asc',
      orderBy: 'domain',
      relativeRange: '14days',
      subaccount: {
        id: 123
      }
    });
  });

  it('requests data on mount for master and all subaccounts', () => {
    const getSpamHits = jest.fn();
    const signalOptions = {
      facet: 'domain',
      facetSearchTerm: 'example.com',
      relativeRange: '14days',
      subaccount: {
        id: undefined,
        name: 'Master & All Subaccounts'
      }
    };

    subject({ getSpamHits, signalOptions });

    expect(getSpamHits).toHaveBeenCalledWith({
      facet: 'domain',
      filter: 'example.com',
      limit: 10,
      offset: 0,
      order: 'asc',
      orderBy: 'domain',
      relativeRange: '14days',
      subaccount: undefined
    });
  });

  it('does not request subaccounts on mount if already loaded', () => {
    const getSubaccounts = jest.fn();
    subject({ getSubaccounts });

    expect(getSubaccounts).not.toHaveBeenCalled();
  });

  it('requests subaccounts on mount', () => {
    const getSubaccounts = jest.fn();
    subject({ getSubaccounts, subaccounts: {}});

    expect(getSubaccounts).toHaveBeenCalled();
  });

  it('requests data on signal options update', () => {
    const getSpamHits = jest.fn();
    const wrapper = subject();
    wrapper.setProps({ getSpamHits, signalOptions: {}});

    expect(getSpamHits).toHaveBeenCalled();
  });

  it('requests data on summary table update', () => {
    const getSpamHits = jest.fn();
    const wrapper = subject();
    wrapper.setProps({ getSpamHits, summaryTable: {}});

    expect(getSpamHits).toHaveBeenCalled();
  });

  describe('history component', () => {
    const factory = ({ calculation, chartType, history, ...props }) => {
      const wrapper = subject({
        history,
        metaData: { currentMax: 200, currentRelativeMax: 40 }
      });
      wrapper.setState({ calculation, chartType });
      const Column = wrapper.find('Column[dataKey="history"]').prop('component');

      return shallow(<Column {...props} domain="example.com" />);
    };

    it('renders absolute bar chart', () => {
      const wrapper = factory({ chartType: 'bar' });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders relative bar chart', () => {
      const wrapper = factory({ calculation: 'relative', chartType: 'bar' });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders absolute sparkline', () => {
      const wrapper = factory({ chartType: 'line' });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders relative sparkline', () => {
      const wrapper = factory({ calculation: 'relative', chartType: 'line' });
      expect(wrapper).toMatchSnapshot();
    });

    it('redirects to details page when bar is clicked', () => {
      const historyPush = jest.fn();
      const wrapper = factory({ chartType: 'bar', history: { push: historyPush }});
      wrapper.simulate('click', { date: '2018-01-13' });

      expect(historyPush).toHaveBeenCalledWith({
        pathname: '/signals/spam-traps/domain/example.com',
        search: { subaccount: undefined },
        state: { date: '2018-01-13' }
      });
    });

    it('redirects to details page when dot is clicked', () => {
      const historyPush = jest.fn();
      const wrapper = factory({ chartType: 'line', history: { push: historyPush }});
      wrapper.simulate('click', { date: '2018-01-13' });

      expect(historyPush).toHaveBeenCalledWith({
        pathname: '/signals/spam-traps/domain/example.com',
        search: { subaccount: undefined },
        state: { date: '2018-01-13' }
      });
    });
  });

  describe('current_hits component', () => {
    const factory = ({ calculation, ...props }) => {
      const wrapper = subject();
      wrapper.setState({ calculation });
      const dataKey = calculation === 'relative' ? 'current_relative_trap_hits' : 'current_trap_hits';
      const Column = wrapper.find(`Column[dataKey="${dataKey}"]`).prop('component');

      return shallow(<Column {...props} />);
    };

    it('renders current count', () => {
      const wrapper = factory({ calculation: 'absolute', current_trap_hits: 123 });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders current rate', () => {
      const wrapper = factory({ calculation: 'relative', current_relative_trap_hits: 234 });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
