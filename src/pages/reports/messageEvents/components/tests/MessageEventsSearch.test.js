import { shallow } from 'enzyme';
import React from 'react';
import { MessageEventsSearch } from '../MessageEventsSearch';

describe('Component: MessageEventsSearch', () => {

  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      getMessageEvents: jest.fn(),
      search: {
        dateOptions: {},
        recipients: []
      },
      refreshMessageEventsDateRange: jest.fn(),
      updateMessageEventsSearchOptions: jest.fn(),
      now: new Date('2018-02-15T12:00:00Z')
    };
    wrapper = shallow(<MessageEventsSearch {...props} />);
    instance = wrapper.instance();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('refreshes on change', () => {
    const search = { dateOptions: {}, recipients: [], changed: 'something' };
    wrapper.setProps({ search });
    expect(props.getMessageEvents).toHaveBeenCalledWith(search);
  });

  describe('parseAddresses', () => {

    it('parse email addresses correctly', () => {
      expect(instance.parseAddresses('email@domain.com, email2@domain.com')).toEqual(['email@domain.com', 'email2@domain.com']);
      expect(instance.parseAddresses('email@domain.com ,email2@domain.com')).toEqual(['email@domain.com', 'email2@domain.com']);
      expect(instance.parseAddresses('email@domain.com , ')).toEqual(['email@domain.com']);
      expect(instance.parseAddresses('')).toEqual([]); //empty array if no valid emails
    });
  });

  describe('getInvalidAddresses', () => {
    it('detect invalid email addresses correctly', () => {
      expect(instance.getInvalidAddresses(['email@domain.com', 'email2m'])).toEqual(['email2m']);
      expect(instance.getInvalidAddresses(['abc'])).toEqual(['abc']);
      expect(instance.getInvalidAddresses([''])).toEqual([]);
      expect(instance.getInvalidAddresses(['email@domain.com'])).toEqual([]);
    });
  });

  describe('emailValidator', () => {
    it('returns correct validation error', () => {
      expect(instance.emailValidator('')).toEqual(undefined);
      expect(instance.emailValidator('email@domain.com, email2@domain.com')).toEqual(undefined);
      expect(instance.emailValidator('email@domain.com ,email2')).toEqual('email2 is not a valid email address');
      expect(instance.emailValidator('email.com ,email2')).toEqual('email.com, email2 are not valid email addresses');
    });
  });

  describe('recipients field', () => {

    it('should update recipients on blur', () => {
      const event = {
        target: {
          value: ''
        }
      };

      event.target.value = 'email@domain.com';
      wrapper.find({ name: 'recipients' }).simulate('blur', event);
      expect(props.updateMessageEventsSearchOptions).toHaveBeenLastCalledWith({
        recipients: ['email@domain.com']
      });

      event.target.value = 'email1@domain.com , email2@domain.com';
      wrapper.find({ name: 'recipients' }).simulate('blur', event);
      expect(props.updateMessageEventsSearchOptions).toHaveBeenLastCalledWith({
        recipients: ['email1@domain.com', 'email2@domain.com']
      });
    });

    it('does not refresh on invalid recipient', () => {
      const event = {
        target: {
          value: 'abc'
        }
      };

      wrapper.find({ name: 'recipients' }).simulate('blur', event);
      expect(props.updateMessageEventsSearchOptions).not.toHaveBeenCalled();
    });

    it('should update recipients on enter', () => {
      const event = {
        key: 'Enter',
        target: {
          value: 'email@domain.com'
        }
      };

      wrapper.find({ name: 'recipients' }).simulate('keyDown', event);
      expect(props.updateMessageEventsSearchOptions).toHaveBeenLastCalledWith({
        recipients: ['email@domain.com']
      });
    });

  });

});
