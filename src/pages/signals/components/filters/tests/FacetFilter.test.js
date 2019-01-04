import { shallow } from 'enzyme';
import React from 'react';
import { FacetFilter } from '../FacetFilter';

jest.mock('src/helpers/keyEvents', () => ({ onEnter: (fn) => fn }));

describe('FacetFilter', () => {
  const subject = (props = {}) => shallow(
    <FacetFilter signalOptions={{ facet: 'campaign' }} {...props} />
  );

  it('renders facet select and search input', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders only facet select', () => {
    expect(subject({ signalOptions: { facet: undefined }})).toMatchSnapshot();
  });

  it('hydrates searchTerm state on mount', () => {
    const wrapper = subject({ signalOptions: { facetSearchTerm: 'example' }});
    expect(wrapper.state('searchTerm')).toEqual('example');
  });

  it('calls changeSignalOptions when facet changes', () => {
    const changeSignalOptions = jest.fn();
    const wrapper = subject({ changeSignalOptions });

    wrapper.find('Select').simulate('change', { currentTarget: { value: 'campaign' }});

    expect(changeSignalOptions).toHaveBeenCalledWith({
      facet: 'campaign',
      facetSearchTerm: ''
    });
  });

  it('sets searchTerm state when search input changes', () => {
    const wrapper = subject();
    wrapper.find('TextField').simulate('change', { currentTarget: { value: 'examp' }});
    expect(wrapper.state('searchTerm')).toEqual('examp');
  });

  it('calls changeSignalOptions when search term is entered', () => {
    const changeSignalOptions = jest.fn();
    const wrapper = subject({ changeSignalOptions });

    wrapper.find('TextField').simulate('change', { currentTarget: { value: 'example' }});
    wrapper.find('TextField').simulate('keypress');

    expect(changeSignalOptions).toHaveBeenCalledWith({ facetSearchTerm: 'example' });
  });
});
