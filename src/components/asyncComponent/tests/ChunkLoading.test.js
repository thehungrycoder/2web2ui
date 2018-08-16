import React from 'react';
import { shallow } from 'enzyme';
import cases from 'jest-in-case';
import { ChunkLoading } from '../ChunkLoading';

const CustomLoading = () => '';

describe('ChunkLoading', () => {

  cases('render cases', (props) => {
    const wrapper = shallow(<ChunkLoading {...props} />);
    expect(wrapper).toMatchSnapshot();
  }, {
    'should return null': {},
    'should render loading': {
      pastDelay: true
    },
    'should render custom loading': {
      LoadingComponent: CustomLoading,
      pastDelay: true
    }
  });


  it('should show an alert with an error on update', () => {
    const props = { showAlert: jest.fn() };
    const wrapper = shallow(<ChunkLoading {...props} />);
    wrapper.setProps({ error: 'simulate error' });
    expect(props.showAlert.mock.calls).toMatchSnapshot();
  });

  it('should handle retry action', () => {
    const spy = jest.spyOn(window.location, 'reload').mockImplementation();
    const wrapper = shallow(<ChunkLoading />);

    wrapper.instance().handleRetry();
    expect(spy).toHaveBeenCalledWith(true);
  });
});
