import { shallow } from 'enzyme';
import React from 'react';
import cases from 'jest-in-case';

import ContentEditor from './ContentEditor';

describe('ContentEditor', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    wrapper = shallow(<ContentEditor {...props} />);
  });

  it('should render', () => {
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.state().selectedTab).toBe(0);
  });

  it('should render without test data tab', () => {
    wrapper.setProps({ contentOnly: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should render editor with an action', () => {
    wrapper.setProps({ action: <a>Click Here</a> });
    expect(wrapper.exists('.Action')).toEqual(true);
  });

  it('should select tabs', () => {
    wrapper.find('Tabs').props().tabs[1].onClick();
    expect(wrapper.state().selectedTab).toBe(1);
  });

  it('should set field read only correctly', () => {
    wrapper.setProps({ readOnly: true });
    expect(wrapper.find('Field').props().readOnly).toBe(true);

    // 'Test Data' is always editable
    wrapper.instance().handleTab(2);
    wrapper.update();
    expect(wrapper.find('Field').props().readOnly).toBe(false);
  });

  it('should set syntax validation correctly', () => {
    wrapper.instance().handleTab(1);
    wrapper.update();
    expect(wrapper.find('Field').props().syntaxValidation).toBe(false);

    wrapper.instance().handleTab(2);
    wrapper.update();
    expect(wrapper.find('Field').props().syntaxValidation).toBe(true);
  });

  cases('.normalize', ({ expected, value }) => {
    expect(wrapper.instance().normalize(value)).toEqual(expected);
  }, {
    'when undefined': {
      expected: '',
      value: undefined
    },
    'when empty': {
      expected: '',
      value: ' \t\n\t '
    },
    'when filled': {
      expected: ' <p>testing</p> ',
      value: ' <p>testing</p> '
    }
  });

  describe('.requiredHtmlOrText', () => {
    const subject = (content) => (
      wrapper.instance().requiredHtmlOrText(undefined, { content })
    );

    it('returns undefined with html content', () => {
      expect(subject({ html: '<p>test</p>' })).toBeUndefined();
    });

    it('returns undefined with text content', () => {
      expect(subject({ text: 'test' })).toBeUndefined();
    });

    it('returns undefined with html and text content', () => {
      expect(subject({ html: '<p>test</p>', text: 'test' })).toBeUndefined();
    });

    it('returns required validation message', () => {
      expect(subject({})).toMatch(/required/);
    });

    it('returns required validation message with whitespace', () => {
      expect(subject({ html: '     ' })).toMatch(/required/);
    });

    it('returns required validation message with null', () => {
      expect(subject({ html: null })).toMatch(/required/);
    });
  });

  describe('.validTestDataJson', () => {
    const subject = (testData) => (
      wrapper.instance().validTestDataJson(undefined, { testData })
    );

    it('returns undefined with valid test data json', () => {
      expect(subject('{}')).toBeUndefined();
    });

    it('returns undefined when test data tab is invalid, but hidden', () => {
      wrapper.setProps({ contentOnly: true });
      expect(subject(undefined)).toBeUndefined();
    });

    it('returns invalid message', () => {
      expect(subject('')).toMatch(/invalid/i);
    });
  });
});
