import { shallow } from 'enzyme';
import React from 'react';
import { BasicFilter } from '../BasicFilter';

describe('BasicFilter', () => {

  let props;
  let wrapper;
  let instance;

  beforeEach(() => {
    props = {
      getMessageEvents: jest.fn(),
      reportOptions: {},
      refreshReportOptions: jest.fn()
    };
    wrapper = shallow(<BasicFilter {...props} />);
    instance = wrapper.instance();
  });

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('refreshes on change', () => {
    wrapper.setProps({ reportOptions: {}});
    expect(props.getMessageEvents).toHaveBeenCalledTimes(1);
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

  describe('handleRecipientsChange', () => {
    it('sets state and refreshes on valid recipients', () => {
      const event = {
        target: {
          value: ''
        }
      };

      event.target.value = 'email@domain.com';
      instance.handleRecipientsChange(event);
      expect(wrapper.state().recipients).toEqual('email@domain.com');

      event.target.value = 'email1@domain.com , email2@domain.com';
      instance.handleRecipientsChange(event);
      expect(wrapper.state().recipients).toEqual('email1@domain.com,email2@domain.com');

      expect(props.getMessageEvents).toHaveBeenCalledTimes(2);
    });

    it('does not refresh on invalid recipient', () => {
      const event = {
        target: {
          value: 'abc'
        }
      };

      instance.handleRecipientsChange(event);
      expect(wrapper.state().recipients).toEqual('');
      expect(props.getMessageEvents).toHaveBeenCalledTimes(0);
    });

    it('does not refresh when value is unchanged', () => {
      const event = {
        target: {
          value: 'foo@bar.com'
        }
      };
      wrapper.setState({ recipients: 'foo@bar.com' });

      instance.handleRecipientsChange(event);
      expect(wrapper.state().recipients).toEqual('foo@bar.com');
      expect(props.getMessageEvents).toHaveBeenCalledTimes(0);
    });
  });

});
