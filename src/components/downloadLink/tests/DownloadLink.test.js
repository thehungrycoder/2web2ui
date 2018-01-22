import React from 'react';
import { shallow } from 'enzyme';

import DownloadLink from '../DownloadLink';

it('renders a downloadable link', () => {
  const wrapper = shallow(<DownloadLink href="/path/to/click.me">Click Me</DownloadLink>);
  expect(wrapper).toMatchSnapshot();
});
