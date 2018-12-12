import React from 'react';
import { shallow } from 'enzyme';

import PreviewPanel from '../PreviewPanel';

const props = {
  html: '<h1>Test Template</h1>',
  text: 'Test Template',
  amp_html: '<h2>Test Template</h2>'
};

it('renders blank panel', () => {
  const wrapper = shallow(<PreviewPanel />);
  expect(wrapper).toMatchSnapshot();
});

it('renders HTML by default', () => {
  const wrapper = shallow(<PreviewPanel {...props} />);
  expect(wrapper).toMatchSnapshot();
});

it('renders text on tab click', () => {
  const wrapper = shallow(<PreviewPanel {...props} />);

  // @todo should be able to .find() the Text tab then .simulate('click')
  wrapper.instance().onChange({
    currentTarget: {
      text: 'Text'
    }
  });
  wrapper.update();

  expect(wrapper).toMatchSnapshot();
});

it('renders AMP HTML on tab click', () => {
  const wrapper = shallow(<PreviewPanel {...props} isAmpLive={true} />);

  // @todo should be able to .find() the AMP HTML tab then .simulate('click')
  wrapper.instance().onChange({
    currentTarget: {
      text: 'AMP HTML'
    }
  });
  wrapper.update();

  expect(wrapper).toMatchSnapshot();
});
