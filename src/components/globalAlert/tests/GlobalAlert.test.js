import React from 'react';
import { GlobalAlert } from '../GlobalAlert';
import { mount, shallow } from 'enzyme';

describe('GlobalAlert', () => {
  const props = {
    error: {
      message: 'Oh no'
    }
  };

  describe('Mounted', () => {

    it('should mount', () => {
      const willReceivePropsSpy = jest.spyOn(GlobalAlert.prototype, 'componentWillReceiveProps');
      const wrapper = mount(<GlobalAlert/>);
      expect(willReceivePropsSpy).not.toHaveBeenCalled();
      expect(wrapper.state()).toEqual({ show: false });
      willReceivePropsSpy.mockRestore();
    });

    it('should componentWillReceiveProps', () => {
      const willReceivePropsSpy = jest.spyOn(GlobalAlert.prototype, 'componentWillReceiveProps');
      const wrapper = mount(<GlobalAlert />);
      expect(willReceivePropsSpy).not.toHaveBeenCalled();
      wrapper.setProps(props);
      expect(willReceivePropsSpy).toHaveBeenCalled();
      expect(wrapper.state()).toEqual({ show: true });
      willReceivePropsSpy.mockRestore();
    });

    it('should dismis banner', () => {
      const wrapper = mount(<GlobalAlert />);
      wrapper.setProps(props);
      expect(wrapper.state()).toEqual({ show: true });
      wrapper.find('.Matchbox-Banner__Dismiss').simulate('click');
      expect(wrapper.state()).toEqual({ show: false });
    });
  });

  // TODO: decide if also necessary
  describe('Shallow', () => {
    it('should render with no props', () => {
      const wrapper = shallow(<GlobalAlert />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render with error', () => {
      const wrapper = shallow(<GlobalAlert {...props}/>);
      expect(wrapper).toMatchSnapshot();
    });
  });

});
