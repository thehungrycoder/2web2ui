import React from 'react';
import { shallow } from 'enzyme';

import DownloadLink from '../DownloadLink';

describe('DownloadLink', () => {
  it('renders a downloadable link', () => {
    const wrapper = shallow(<DownloadLink href="/path/to/click.me">Click Me</DownloadLink>);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders with a custom component', () => {
    const TestComponent = ({ children, ...props }) => <span {...props}>{children}</span>;
    const wrapper = shallow(
      <DownloadLink component={TestComponent} href='/path/to/click.me' pass='through'>
        Click Me 2
      </DownloadLink>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
