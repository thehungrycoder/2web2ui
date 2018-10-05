import React from 'react';
import { shallow } from 'enzyme';
import EventTypeFilters from '../EventTypeFilters';

describe('EventTypeFilters', () => {
  let props;

  beforeEach(() => {
    props = {
      eventTypeDocs: [
        { type: 'amp_open', displayName: 'AMP Open', description: 'AMP open desc' },
        { type: 'bounce' , displayName: 'Bounce', description: 'Bounce desc' }
      ],
      checkedTypes: {},
      onChange: jest.fn()
    };
  });

  it('should render from a list of event types', () => {
    const wrapper = shallow(<EventTypeFilters {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render checked state', () => {
    props.checkedTypes.bounce = true;
    const wrapper = shallow(<EventTypeFilters {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
