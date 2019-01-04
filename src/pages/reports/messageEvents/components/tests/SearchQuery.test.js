import React from 'react';
import { shallow } from 'enzyme';
import SearchQuery from '../SearchQuery';

jest.mock('src/constants', () => ({
  EVENTS_SEARCH_FILTERS: {
    recipient_domains: { comma: true, wildcard: false, placeholder: '', label: 'Recipient Domains' },
    subject: { comma: false, wildcard: true, placeholder: '', label: 'Subject' }
  }
}));


describe('SearchForm', () => {
  let props;
  let wrapper;
  let filters;

  //Copied from redux-forms with minor changes
  const map = jest.fn((callback) => (filters).map(function (item, index) {
    return callback(`${'searchQuery' + '['}${index}]`, index);
  }));

  beforeEach(() => {
    props = {
      fields: {
        map,
        getAll: jest.fn(() => filters),
        get: jest.fn((index) => filters[index]),
        push: jest.fn(),
        remove: jest.fn()
      }
    };
    filters = [{ key: 'recipient_domains', value: 'foo' }, { key: 'subject', value: 'bar' }, { key: '', value: '' } ];
    wrapper = shallow(<SearchQuery {...props} />);
  });

  it('should render correctly with no filters', () => {
    filters = [];
    wrapper = shallow(<SearchQuery {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with existing filters', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('add button works', () => {
    wrapper.find('Button').first().simulate('click');
    expect(props.fields.push).toHaveBeenCalled();
  });

  it('remove button works', () => {
    wrapper.find('Button').last().simulate('click');
    expect(props.fields.remove).toHaveBeenCalledWith(2);
  });

});
