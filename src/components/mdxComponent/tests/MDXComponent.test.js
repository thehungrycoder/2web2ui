import { shallow } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import MDXComponent, { transformLink } from '../MDXComponent';

describe('Component: MDX Wrapper', () => {

  it('should render correctly', () => {
    const TestComponent = () => <p>Test component</p>;
    expect(shallow(<MDXComponent component={TestComponent} />)).toMatchSnapshot();
  });

  describe('markdown link factory', () => {

    it('should transform external links', () => {
      const element = { href: 'http://google.com', otherProp: true };
      const children = <span>jsx children</span>;
      expect(shallow(transformLink(element, children))).toMatchSnapshot();
    });

    it('should transform internal links', () => {
      const element = { href: '/some/route', otherProp: true };
      const children = <span>jsx children</span>;
      const component = <MemoryRouter>{transformLink(element, children)}</MemoryRouter>;
      expect(shallow(component).find('Link')).toMatchSnapshot();
    });

  });

});
