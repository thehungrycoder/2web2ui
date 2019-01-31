import React from 'react';
import { shallow } from 'enzyme';
import FromEmail from '../FromEmail';

jest.mock('lodash/debounce', () => jest.fn((fn) => {
  fn.cancel = jest.fn();
  return fn;
}));

describe('FromEmail', () => {
  const subject = (props = {}) => shallow(
    <FromEmail
      domains={[
        { domain: 'apples.com' },
        { domain: 'apricot.com' },
        { domain: 'aubergine.com' },
        { domain: 'bananas.com' }
      ]}
      onChange={jest.fn()}
      value="test@a"
      {...props}
    />
  );

  it('derives selected item', () => {
    expect(subject()).toHaveProp('selectedItem', 'test@a');
  });

  it('calls onChange when ', () => {
    const onChange = jest.fn();
    const wrapper = subject({ onChange });

    wrapper.shallow()
      .find('FromEmailInput')
      .simulate('change', 'test@b');

    expect(onChange).toHaveBeenCalledWith('test@b');
  });

  it('highlights first item when no other item is highlighted', () => {
    const setHighlightedIndex = jest.fn();
    const wrapper = subject();
    const changes = {};
    const downshift = { setHighlightedIndex };

    wrapper.simulate('stateChange', changes, downshift);

    expect(setHighlightedIndex).toHaveBeenCalledWith(0);
  });

  it.each([
    ['matches on value change', {
      inputValue: 'brian@a',
      matched: [
        'brian@apples.com',
        'brian@apricot.com',
        'brian@aubergine.com'
      ]
    }],
    ['excludes an exact match', {
      inputValue: 'brian@bananas.com',
      matched: []
    }],
    ['reset matches when value is missing an at sign', {
      initialMatches: ['bananas.com'],
      inputValue: 'brian',
      matched: []
    }]
  ])('%s', (testName, { initialMatches, inputValue, matched }) => {
    const wrapper = subject();

    if (initialMatches) {
      wrapper.setState({ matches: initialMatches });
    }

    wrapper.simulate('inputValueChange', inputValue);

    expect(wrapper.shallow().find('FromEmailMenu')).toHaveProp('items', matched);
  });

  it('truncates matches to top 100', () => {
    const domains = Array.from(Array(110)).map((_, index) => ({ domain: `example${index}.com` }));
    const wrapper = subject({ domains });
    wrapper.simulate('inputValueChange', 'brian@example');

    expect(wrapper.state('matches')).toHaveLength(100);
  });

  it('cancels debounced updates when unmounted', () => {
    const wrapper = subject();
    const cancel = jest.spyOn(wrapper.instance().updateMatches, 'cancel');
    wrapper.unmount();
    expect(cancel).toHaveBeenCalled();
  });
});
