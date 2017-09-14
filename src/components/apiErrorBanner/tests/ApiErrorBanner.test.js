import React from 'react';
import _ from 'lodash';
import ApiErrorBanner from '../ApiErrorBanner';

describe('ApiErrorBanner Component', () => {
  const props = {
    message: 'Clean the conference room',
    title: 'You Have Another Mission',
    status:'info'
  };

  it('should render with no props', () => {
    const wrapper = shallow(<ApiErrorBanner />)

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with props', () => {
    const wrapper = shallow(<ApiErrorBanner {...props}/>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with reload', () => {
    const reloadProps = _.cloneDeep(props);
    reloadProps.reload = () => {};

    const wrapper = shallow(<ApiErrorBanner {...reloadProps}/>);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render with details', () => {
    const detailsProps = _.cloneDeep(props);
    detailsProps.errorDetails = 'Got Damn!';

    const wrapper = shallow(<ApiErrorBanner {...detailsProps}/>);

    expect(wrapper).toMatchSnapshot();

    // Second t on the snapshot = show details button
    wrapper.find('t').at(1).simulate('click');
    expect(wrapper).toMatchSnapshot();
  });
});
