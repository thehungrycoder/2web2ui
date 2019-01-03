import React from 'react';
import { shallow } from 'enzyme';
import Callout from './Callout';

describe('Callout', () => {
  it('renders title', () => {
    const wrapper = shallow(<Callout title="Example" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders title and details', () => {
    const wrapper = shallow(
      <Callout title="Example">
        Here is the deal...
      </Callout>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
