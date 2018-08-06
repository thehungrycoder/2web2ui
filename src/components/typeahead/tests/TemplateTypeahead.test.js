import { shallow } from 'enzyme';
import React from 'react';
import { TemplateTypeahead } from '../TemplateTypeahead';

const results = [
  { id: 'tmpl-1', name: 'Template 1' },
  { id: 'tmpl-2', name: 'Template 2' },
  { id: 'tmpl-3', name: 'Template 3' }
];

describe('Template Typeahead', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      onChange: jest.fn(),
      listTemplates: jest.fn(),
      results: []
    };

    wrapper = shallow(<TemplateTypeahead {...props} />);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render if account has no templates', () => {
    wrapper.setProps({ hasTemplates: false });
    expect(wrapper.html()).not.toEqual(null);
  });

  it('should get templates', () => {
    expect(wrapper.instance().props.listTemplates).toHaveBeenCalledTimes(1);
  });

  it('should not get templates if list already exists', () => {
    wrapper.setProps({ results: ['1', '2']});
    wrapper.instance().componentDidMount();
    expect(wrapper.instance().props.listTemplates).not.toHaveBeenCalledTimes(2);
  });

  it('should render itemToString correctly', () => {
    wrapper.setProps({ hasTemplates: true });
    const noItem = wrapper.find('Typeahead').props().itemToString();
    const item = wrapper.find('Typeahead').props().itemToString({ id: 'tmpl-10101' });
    expect(noItem).toEqual('');
    expect(item).toEqual('tmpl-10101');
  });

  it('should renderItem correctly', () => {
    wrapper.setProps({ hasTemplates: true });
    const item = wrapper.find('Typeahead').props().renderItem({ id: 'tmpl-10101' });
    expect(item).toMatchSnapshot();
  });

  describe('render function', () => {
    it('should render the list', () => {
      wrapper.setProps({ results: results, hasTemplates: true });
      expect(wrapper).toMatchSnapshot();
    });

    it('should render the list (disabled)', () => {
      wrapper.setProps({ results: [], hasTemplates: false });
      expect(wrapper).toMatchSnapshot();
    });
  });
});
