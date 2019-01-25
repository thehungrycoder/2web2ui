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

  it('renders input with value and menu with matches', () => {
    const wrapper = subject();
    wrapper.simulate('inputValueChange', 'brian@bananas'); // to populate matches
    expect(wrapper.shallow()).toMatchSnapshot();
  });

  it('calls onChange when state changes', () => {
    const onChange = jest.fn();
    const wrapper = subject({ onChange });
    const changes = { selectedItem: 'test@b' };
    const downshift = { highlightedIndex: 1 };

    wrapper.simulate('stateChange', changes, downshift);

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

  it('reset matches when value is missing an ampersand', () => {
    const wrapper = subject();

    wrapper.setState({ matches: ['bananas.com']}); // hydrate state
    wrapper.simulate('inputValueChange', 'brian');

    expect(wrapper).toHaveState('matches', []);
  });

  it('matches on value change', () => {
    const wrapper = subject();
    wrapper.simulate('inputValueChange', 'brian@a');
    expect(wrapper)
      .toHaveState('matches', ['brian@apples.com', 'brian@apricot.com', 'brian@aubergine.com']);
  });

  it('excludes an exact match', () => {
    const wrapper = subject();
    wrapper.simulate('inputValueChange', 'brian@bananas.com');
    expect(wrapper).toHaveState('matches', []);
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
