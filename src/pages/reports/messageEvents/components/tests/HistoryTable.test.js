import React from 'react';
import { shallow } from 'enzyme';
import HistoryTable from '../HistoryTable';

describe('HistoryTable Component', () => {
  it('should render with no props', () => {
    const wrapper = shallow(<HistoryTable />);
    expect(wrapper).toMatchSnapshot();
  });

  const props = {
    handleEventClick: jest.fn(),
    messageHistory: [{ event_id: '1' }, { event_id: '2' }],
    selectedId: '2'
  };

  it('should render with all props', () => {
    const wrapper = shallow(<HistoryTable {...props} />);
    expect(wrapper.find('TableCollection')).toMatchSnapshot();
  });

  it('should not show disclaimer if first event is injection', () => {
    props.messageHistory.push({ event_id: '3', type: 'injection' });
    const wrapper = shallow(<HistoryTable {...props} />);
    expect(wrapper.find('small')).toHaveLength(0);
  });
});
