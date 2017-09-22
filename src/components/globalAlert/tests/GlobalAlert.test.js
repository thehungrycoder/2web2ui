import React from 'react';
import { GlobalAlert } from '../GlobalAlert';
import { mount, shallow } from 'enzyme';

describe('GlobalAlert', () => {
  const props = {
    type: 'error',
    message: 'Oh no',
    details: 'details'
  };

  describe('Mounted', () => {

    it('should mount', () => {
      const willReceivePropsSpy = jest.spyOn(GlobalAlert.prototype, 'componentWillReceiveProps');
      const wrapper = mount(<GlobalAlert/>);
      expect(willReceivePropsSpy).not.toHaveBeenCalled();
      expect(wrapper.state()).toEqual({ show: false, showDetails: false });
      willReceivePropsSpy.mockRestore();
    });

    it('should componentWillReceiveProps', () => {
      const willReceivePropsSpy = jest.spyOn(GlobalAlert.prototype, 'componentWillReceiveProps');
      const wrapper = mount(<GlobalAlert />);
      expect(willReceivePropsSpy).not.toHaveBeenCalled();
      wrapper.setProps(props);
      expect(willReceivePropsSpy).toHaveBeenCalled();
      expect(wrapper.state()).toEqual({ show: true, showDetails: false });
      willReceivePropsSpy.mockRestore();
    });

    it('should show details', () => {
      const wrapper = mount(<GlobalAlert />);
      wrapper.setProps(props);
      expect(wrapper.state()).toEqual({ show: true, showDetails: false });
      wrapper.find('.Matchbox-Snackbar__Content a').simulate('click');
      expect(wrapper.state()).toEqual({ show: true, showDetails: true });
    });

    it('should dismiss alert', () => {
      const handleDismissSpy = jest.spyOn(GlobalAlert.prototype, 'handleDismiss');
      const wrapper = mount(<GlobalAlert />);
      wrapper.setProps(props);
      expect(wrapper.state()).toEqual({ show: true, showDetails: false });
      wrapper.find('.Matchbox-Snackbar__Dismiss').simulate('click');
      expect(handleDismissSpy).toHaveBeenCalled();
      expect(wrapper.state()).toEqual({ show: false, showDetails: false });
    });
  });

  // TODO: decide if also necessary
  describe('Shallow', () => {
    it('should render with no props', () => {
      const wrapper = shallow(<GlobalAlert />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render with error details', () => {
      const wrapper = shallow(<GlobalAlert {...props}/>);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render without error details', () => {
      const wrapper = shallow(<GlobalAlert {...props} details={null} />);
      expect(wrapper).toMatchSnapshot();
    });
  });

});
