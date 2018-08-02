import { shallow } from 'enzyme';
import React from 'react';
import Section from '../Section';

describe('Section Component', () => {
  it('should render correctly', () => {
    const wrapper = shallow(
      <Section title='a section'>
        <Section.Left>
          left
        </Section.Left>
        <Section.Right>
          right
        </Section.Right>
      </Section>
    );

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('Left').dive()).toMatchSnapshot();
    expect(wrapper.find('Right').dive()).toMatchSnapshot();
  });
});
