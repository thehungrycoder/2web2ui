import { shallow } from 'enzyme';
import React from 'react';
import { Name, Actions, Status, LastUpdated } from '../ListComponents';

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

    it('should navigate to published page if template is published', () => {
      wrapper.setProps({ published: true });
      expect(wrapper.find('Link').props().to).toEqual('/templates/edit/id-123/published?subaccount=123');
    });
  });

  describe('Status', () => {
    it('should render published', () => {
      expect(shallow(<Status published={true} has_draft={true} has_published={true} />)).toMatchSnapshot();
    });

    it('should render draft', () => {
      expect(shallow(<Status published={false} has_draft={true} has_published={false} />)).toMatchSnapshot();
    });

    it('should render unpublished changes', () => {
      expect(shallow(<Status published={false} has_draft={true} has_published={true} />)).toMatchSnapshot();
    });
  });

  describe('Actions', () => {
    it('should render correct actions when published', () => {
      expect(shallow(<Actions id={10} subaccount_id={101} published={true} has_draft={true} has_published={true} />)).toMatchSnapshot();
    });

    it('should render correct actions when not published', () => {
      expect(shallow(<Actions id={10} subaccount_id={101} published={false} has_draft={true} has_published={false} />)).toMatchSnapshot();
    });

    it('should render correct actions with unpublished changes', () => {
      expect(shallow(<Actions id={10} subaccount_id={101} published={false} has_draft={true} has_published={true} />)).toMatchSnapshot();
    });
  });

  describe('LastUpdated', () => {
    it('should render', () => {
      expect(shallow(<LastUpdated last_update_time='2017-08-10T14:15:16+00:00' />)).toMatchSnapshot();
    });
  });
});
