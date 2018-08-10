import { shallow } from 'enzyme';
import React from 'react';
import StatusView from '../StatusView';
import * as dateMock from 'src/helpers/date';

jest.mock('src/helpers/date');

describe('Status View Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      test: {
        start_time: '2018-05-00T12:00:00.000Z',
        end_time: '2018-05-55T12:00:00.000Z',
        test_mode: 'bayesian',
        winning_template_id: 'winner',
        default_template: {
          template_id: 'default'
        }
      }
    };
    dateMock.formatDateTime.mockImplementation((a) => a);
    wrapper = shallow(<StatusView {...props} />);
  });

  it('should render correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render winning template in bayesian mode correctly', () => {
    expect(wrapper.find('Winner').dive()).toMatchSnapshot();
  });

  it('should render winning template in learning mode correctly', () => {
    wrapper.setProps({ test: { ...props.test, test_mode: 'learning' }});
    expect(wrapper.find('Winner').dive()).toMatchSnapshot();
  });

  it('should render a default winning template correctly', () => {
    wrapper.setProps({ test: { ...props.test, winning_template_id: 'default' }});
    expect(wrapper.find('Winner').dive()).toMatchSnapshot();
  });

  it('should not render with no winning template', () => {
    wrapper.setProps({ test: { ...props.test, winning_template_id: null }});
    expect(wrapper.find('Winner').dive().html()).toBe(null);
  });
});
