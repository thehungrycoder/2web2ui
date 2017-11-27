import React from 'react';
import { shallow } from 'enzyme';
import { Row, Header, TableWrapper } from '../TableElements';

describe('Row Component', () => {
  it('should render', () => {
    const props = {
      onClick: jest.fn(),
      selected: false,
      type: 'event_type',
      timestamp: 'ts',
      formattedDate: 'date'
    };
    const wrapper = shallow(<Row {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Header Component', () => {
  it('should render', () => {
    const wrapper = shallow(<Header />);
    expect(wrapper).toMatchSnapshot();
  });
});

describe('Table Wrapper Component', () => {
  it('should render', () => {
    const wrapper = shallow(<TableWrapper />);
    expect(wrapper).toMatchSnapshot();
  });
});
