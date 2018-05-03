import React from 'react';
import { Navigation } from '../Navigation';
import { shallow } from 'enzyme';

describe('Navigation', () => {

  describe('Navigation tests', () => {
    let props;
    let wrapper;
    let stateSpy;

    beforeEach(() => {
      props = {
        location: '/foo/bar',
        navItems: [
          {
            key: 'value'
          },
          {
            key: 'value2'
          },
          {
            key: 'value3'

          }
        ]
      };

      wrapper = shallow(<Navigation {...props} />);
      stateSpy = jest.spyOn(wrapper.instance(), 'setState');
    });

    it('should render full nav', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should open when clicking div', () => {
      wrapper.find('div').at('1').simulate('click');
      expect(stateSpy).toHaveBeenCalledWith({ open: true });
    });

    it('should open nav when clicking hamburger', () => {
      wrapper.find('a').simulate('click');
      expect(stateSpy).toHaveBeenCalledWith({ open: true });
    });

    it('should close nav when clicking x', () => {
      wrapper.find('Close').simulate('click');
      expect(stateSpy).toHaveBeenCalledWith({ open: true });
    });

    it('should toggle open state', () => {
      wrapper.instance().handleClick();
      expect(stateSpy).toHaveBeenCalledWith({ open: true });
      wrapper.instance().handleClick();
      expect(stateSpy).toHaveBeenCalledWith({ open: false });
    });

  });


});
