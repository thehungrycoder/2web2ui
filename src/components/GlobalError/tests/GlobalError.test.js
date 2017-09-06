import React from 'react';
import sinon from 'sinon';
import { GlobalError } from '../GlobalError';

describe('GlobalError', () => {
  const props = {
    error: {
      message: 'Oh no'
    }
  };

  describe('Mounted', () => {
    sinon.spy(GlobalError.prototype, 'componentWillReceiveProps');

    it('should mount', () => {
      const wrapper = mount(<GlobalError/>);
      expect(GlobalError.prototype.componentWillReceiveProps.calledOnce).toEqual(false);
      expect(wrapper.state()).toEqual({ show: false });
    });

    it('should componentWillReceiveProps', () => {
      const wrapper = mount(<GlobalError />);
      expect(GlobalError.prototype.componentWillReceiveProps.calledOnce).toEqual(false);
      wrapper.setProps(props);
      expect(GlobalError.prototype.componentWillReceiveProps.calledOnce).toEqual(true);
      expect(wrapper.state()).toEqual({ show: true });
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
