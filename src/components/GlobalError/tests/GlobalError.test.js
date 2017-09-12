import React from 'react';
import { GlobalError } from '../GlobalError';

describe('GlobalError', () => {
  const props = {
    error: {
      message: 'Oh no'
    }
  };

  describe('Mounted', () => {

    it('should mount', () => {
      const willReceivePropsSpy = jest.spyOn(GlobalError.prototype, 'componentWillReceiveProps');
      const wrapper = mount(<GlobalError/>);
      expect(willReceivePropsSpy).not.toHaveBeenCalled();
      expect(wrapper.state()).toEqual({ show: false });
      willReceivePropsSpy.mockRestore();
    });

    it('should componentWillReceiveProps', () => {
      const willReceivePropsSpy = jest.spyOn(GlobalError.prototype, 'componentWillReceiveProps');
      const wrapper = mount(<GlobalError />);
      expect(willReceivePropsSpy).not.toHaveBeenCalled();
      wrapper.setProps(props);
      expect(willReceivePropsSpy).toHaveBeenCalled();
      expect(wrapper.state()).toEqual({ show: true });
      willReceivePropsSpy.mockRestore();
    });

    it('should dismis banner', () => {
      const wrapper = mount(<GlobalError />);
      wrapper.setProps(props);
      expect(wrapper.state()).toEqual({ show: true });
      wrapper.find('.Matchbox-Banner__Dismiss').simulate('click');
      expect(wrapper.state()).toEqual({ show: false });
    });
  });

  // TODO: decide if also necessary
  describe('Shallow', () => {
    it('should render with no props', () => {
      const wrapper = shallow(<GlobalError />);
      expect(wrapper).toMatchSnapshot();
    });

    it('should render with error', () => {
      const wrapper = shallow(<GlobalError {...props}/>);
      expect(wrapper).toMatchSnapshot();
    });
  });

});
