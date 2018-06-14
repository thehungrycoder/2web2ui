import { shallow } from 'enzyme';
import React from 'react';
import { Name, Actions, Status } from '../ListComponents';

describe('Template List Components', () => {
  let wrapper;

  describe('Name', () => {
    beforeEach(() => {
      const props = { name: 'template name', id: 'id-123', subaccount_id: 123 };
      wrapper = shallow(<Name {...props} />);
    });

    it('should render', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe('Status', () => {
    it('should render published', () => {
      expect(shallow(<Status has_published={true} />)).toMatchSnapshot();
    });

    it('should render draft', () => {
      expect(shallow(<Status has_published={false} />)).toMatchSnapshot();
    });
  });

  describe('Actions', () => {
    it('should render correct actions when published', () => {
      expect(shallow(<Actions id={10} subaccount_id={101} has_published={true} />)).toMatchSnapshot();
    });

    it('should render correct actions when not published', () => {
      expect(shallow(<Actions id={10} subaccount_id={101} has_published={false} />)).toMatchSnapshot();
    });
  });
});
