import React from 'react';
import { shallow } from 'enzyme';
import { FilteringCollection } from '../FilteringCollection';
import { mkRows } from '../__testHelpers__/rows';

describe('Component: FilteringCollection', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    const rows = mkRows(10);
    props = {
      fetchRows: jest.fn().mockReturnValue({ rows, rowCount: rows.length }),
      rows
    };
    wrapper = shallow(<FilteringCollection {...props} />);
  });

  it('should render initial rows if provided', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch rows on mount if none provided', () => {
    const { rows, ...rest } = props;
    wrapper = shallow(<FilteringCollection {...rest} />);
    expect(props.fetchRows).toHaveBeenCalledWith({ pattern: '' });
  });

  it('should render sync fetched rows', async () => {
    const { rows, ...rest } = props;
    wrapper = shallow(<FilteringCollection {...rest} />);
    await wrapper.instance().handleFilterChange();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should render async fetched rows', async () => {
    const { rows, ...rest } = props;
    props.fetchRows.mockResolvedValue({ rows, rowCount: rows.length });
    wrapper = shallow(<FilteringCollection {...rest} />);
    await wrapper.instance().handleFilterChange();
    wrapper.update();
    expect(wrapper).toMatchSnapshot();
  });

  it('should fetch rows on filter change', () => {
    wrapper.instance().handleFilterChange('row');
    expect(props.fetchRows).toHaveBeenCalledWith({ pattern: 'row' });
  });

  it('should provide filtering for child collections', () => {
    wrapper.setState({ pattern: 'row' });
    const childFetchRows = wrapper.find('TableCollectionView').first().prop('fetchRows');
    childFetchRows({ currentPage: 2, perPage: 15 });
    expect(props.fetchRows).toHaveBeenCalledWith({
      pattern: 'row',
      currentPage: 2,
      perPage: 15
    });
  });
});
