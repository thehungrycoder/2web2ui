import React from 'react';
import { shallow } from 'enzyme';
import { getColumnProps, pickPageProps } from '../utils';

describe('Summary Table Utils', () => {
  describe('.getColumnProps', () => {
    it('return children props', () => {
      const wrapper = shallow(
        <div>
          <div example="one">One</div>
          <div example="two">Two</div>
        </div>
      );

      expect(getColumnProps(wrapper.children())).toMatchSnapshot();
    });
  });

  describe('.pickPageProps', () => {
    it('returns only page props', () => {
      const props = {
        children: () => null,
        currentPage: 1,
        perPage: 10
      };

      expect(pickPageProps(props)).toMatchSnapshot();
    });
  });
});
