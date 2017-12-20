import React from 'react';
import cases from 'jest-in-case';
import { shallow } from 'enzyme';

import { PreviewPage } from '../PreviewPage';

const mockProps = {
  editTemplatePath: '/path/to/edit/template',
  getDraft: jest.fn(),
  getPublished: jest.fn()
};

const TEST_CASES = {
  'renders loading': {
    match: { params: { id: 'test-template' }},
    template: undefined
  },
  'renders draft template': {
    match: { params: { id: 'test-draft' }},
    template: {
      id: 'test-draft',
      name: 'Test Draft'
    }
  },
  'renders published template': {
    match: { params: { id: 'test-published' }},
    template: {
      id: 'test-published',
      name: 'Test Published'
    }
  }
};

afterEach(() => {
  for (const key in mockProps) {
    mockProps[key].mockClear && mockProps[key].mockClear();
  }
});

cases('PreviewPage', (props) => {
  const wrapper = shallow(<PreviewPage {...mockProps} {...props} />);
  expect(wrapper).toMatchSnapshot();
}, TEST_CASES);

test('load draft template', () => {
  const props = {
    isPublished: false,
    match: { params: { id: 'test-draft' }},
    template: undefined
  };

  shallow(<PreviewPage {...mockProps} {...props} />);
  expect(mockProps.getDraft).toHaveBeenCalledWith('test-draft');
});

test('loads published template', () => {
  const props = {
    isPublished: true,
    match: { params: { id: 'test-published' }},
    template: undefined
  };

  shallow(<PreviewPage {...mockProps} {...props} />);
  expect(mockProps.getPublished).toHaveBeenCalledWith('test-published');
});
