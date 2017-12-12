import { shallow } from 'enzyme';
import React from 'react';

import { Results } from '../Results';

let props;
let wrapper;
let results = [];

beforeEach(() => {
  props = {};

  results = [
    { recipient: 'rec1@dom.com', type: 'Transactional', source: 'Manually added' },
    { recipient: 'rec2@dom.com', type: 'Non-transactional', source: 'Manually added', subaccount_id: 101 }
  ];
});

describe('Results', () => {
  it('renders correctly on initial loading', () => {
    props.results = null;
    wrapper = shallow(<Results {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly (empty suppressions)', () => {
    props.results = [];
    wrapper = shallow(<Results {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly (with suppressions)', () => {
    props.results = results;
    wrapper = shallow(<Results {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('renders correctly (with suppressions, with subaccount)', () => {
    props.results = results;
    props.hasSubaccounts = true;
    wrapper = shallow(<Results {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

});
