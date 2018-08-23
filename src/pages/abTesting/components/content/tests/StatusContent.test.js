import { shallow } from 'enzyme';
import React from 'react';
import StatusContent from '../StatusContent';

describe('Status Content Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
      test: {}
    };
    wrapper = shallow(<StatusContent {...props} />);
  });

  it('should render nothing when a test is malformed', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should render draft-specific help content when test is in draft mode', () => {
    wrapper.setProps({ test: { status: 'draft' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render scheduled-specific help content when test is in scheduled mode', () => {
    wrapper.setProps({ test: { status: 'scheduled' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render running-specific help content when test is in running mode', () => {
    wrapper.setProps({ test: { status: 'running' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render cancelled-specific help content when test is in cancelled mode', () => {
    wrapper.setProps({ test: { status: 'cancelled' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render distinct help content when test is completed for learning mode tests', () => {
    wrapper.setProps({ test: { status: 'completed', test_mode: 'learning' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render distinct help content when test is completed for bayesian mode tests and the winner was found', () => {
    wrapper.setProps({ test: { status: 'completed', test_mode: 'bayesian', winning_template_id: 'one', default_template: { template_id: 'two' }}});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render distinct help content when test is completed for bayesian mode tests and the winner was NOT found', () => {
    wrapper.setProps({ test: { status: 'completed', test_mode: 'bayesian', winning_template_id: 'one', default_template: { template_id: 'one' }}});
    expect(wrapper).toMatchSnapshot();
  });

  it('should render rescheduling-specific help content when test is in completed mode and rescheduling the test', () => {
    wrapper.setProps({ test: { status: 'completed' }, rescheduling: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render rescheduling-specific help content when test is in cancelled mode and rescheduling the test', () => {
    wrapper.setProps({ test: { status: 'cancelled' }, rescheduling: true });
    expect(wrapper).toMatchSnapshot();
  });
});
