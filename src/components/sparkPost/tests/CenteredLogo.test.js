import React from 'react';
import CenteredLogo from '../CenteredLogo';
import { shallow } from 'enzyme';

describe(' Component: Centered Logo', () => {
  let wrapper;
  let props;
  beforeEach(() => {
    props = {};
    wrapper = shallow(<CenteredLogo {...props}/>);
  });

  it('renders sparkpost logo', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('renders aws marketplace logo (along with sparkpost)', () => {
    wrapper.setProps({ showAwsLogo: true });
    expect(wrapper).toMatchSnapshot();
  });

});
