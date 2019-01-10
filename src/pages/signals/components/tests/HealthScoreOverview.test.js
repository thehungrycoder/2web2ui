import React from 'react';
import { shallow } from 'enzyme';
import SummaryTable from 'src/components/summaryTable';
import HealthScoreOverview from '../HealthScoreOverview';

describe('HealthScoreOverview', () => {
  const subject = (props = {}) => shallow(
    <HealthScoreOverview
      data={[
        {
          current_health_score: 98,
          domain: 'example.com',
          history: [
            { date: '2018-01-13', health_score: 98 }
          ],
          average_health_score: 98
        }
      ]}
      facet={{
        key: 'domain',
        label: 'Domain',
        sortable: false
      }}
      getHealthScore={() => {}}
      getSubaccounts={() => {}}
      loading={false}
      resetSummaryTable={() => {}}
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

  it('handles chart type change', () => {
    const wrapper = subject();
    wrapper.find('ChartType').simulate('change', 'bar');
    expect(wrapper.state('chartType')).toEqual('bar');
  });

  it('requests data on mount', () => {
    const resetSummaryTable = jest.fn();
    subject({ resetSummaryTable });
    expect(resetSummaryTable).toHaveBeenCalledWith('Test');
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

  it('requests table reset on signal options update', () => {
    const resetSummaryTable = jest.fn();
    const wrapper = subject();
    wrapper.setProps({ resetSummaryTable, signalOptions: {}});

    expect(resetSummaryTable).toHaveBeenCalledWith('Test');
  });

  it('requests data on summary table update', () => {
    const getHealthScore = jest.fn();
    const summaryTable = {
      currentPage: 2,
      perPage: 10
    };
    const wrapper = subject();

    wrapper.setProps({ getHealthScore, summaryTable });

    expect(getHealthScore).toHaveBeenCalledWith({
      facet: 'domain',
      filter: 'example.com',
      limit: 10,
      offset: 10,
      order: undefined,
      orderBy: undefined,
      relativeRange: '14days',
      subaccount: {
        id: 123
      }
    });
  });

  it('requests ordered data on summary table update', () => {
    const getHealthScore = jest.fn();
    const summaryTable = {
      currentPage: 1,
      order: { ascending: true, dataKey: 'domain' },
      perPage: 10
    };
    const wrapper = subject();

    wrapper.setProps({ getHealthScore, summaryTable });

    expect(getHealthScore).toHaveBeenCalledWith(expect.objectContaining({
      order: 'asc',
      orderBy: 'domain'
    }));
  });

  it('requests data without subaccount data on summary table update', () => {
    const getHealthScore = jest.fn();
    const signalOptions = {
      facet: 'domain',
      facetSearchTerm: 'example.com',
      relativeRange: '14days',
      subaccount: {
        id: undefined,
        name: 'Master & All Subaccounts'
      }
    };
    const summaryTable = {
      currentPage: 2,
      perPage: 10
    };
    const wrapper = subject();

    wrapper.setProps({ getHealthScore, signalOptions, summaryTable });

    expect(getHealthScore).toHaveBeenCalledWith(expect.objectContaining({
      subaccount: undefined
    }));
  });

  describe('history component', () => {
    const factory = ({ chartType, history, ...props }) => {
      const wrapper = subject({ history });
      wrapper.setState({ chartType });
      const Column = wrapper.find('Column[dataKey="history"]').prop('component');

      return shallow(<Column {...props} domain="example.com" />);
    };

    it('renders absolute bar chart', () => {
      const wrapper = factory({ chartType: 'bar' });
      expect(wrapper).toMatchSnapshot();
    });

    it('renders absolute sparkline', () => {
      const wrapper = factory({ chartType: 'line' });
      expect(wrapper).toMatchSnapshot();
    });

    it('redirects to details page when bar is clicked', () => {
      const historyPush = jest.fn();
      const wrapper = factory({ chartType: 'bar', history: { push: historyPush }});
      wrapper.simulate('click', { date: '2018-01-13' });

      expect(historyPush).toHaveBeenCalledWith({
        pathname: '/signals/health-score/domain/example.com',
        search: '?subaccount=123',
        state: { date: '2018-01-13' }
      });
    });

    it('redirects to details page when dot is clicked', () => {
      const historyPush = jest.fn();
      const wrapper = factory({ chartType: 'line', history: { push: historyPush }});
      wrapper.simulate('click', { date: '2018-01-13' });

      expect(historyPush).toHaveBeenCalledWith({
        pathname: '/signals/health-score/domain/example.com',
        search: '?subaccount=123',
        state: { date: '2018-01-13' }
      });
    });
  });

  describe('current score column component', () => {
    it('renders current score', () => {
      const wrapper = subject();
      const Column = wrapper.find('Column[dataKey="current_health_score"]').prop('component');
      const columnWrapper = shallow(<Column current_health_score={99} />);

      expect(columnWrapper).toMatchSnapshot();
    });
  });
});
