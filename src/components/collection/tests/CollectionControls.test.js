import React from 'react';
import { shallow } from 'enzyme';
import CollectionControls from '../CollectionControls';

describe('CollectionControls', () => {
  let props;

  beforeEach(() => {
    props = {
      data: [],
      perPage: 25,
      perPageButtons: [10,25],
      onPerPageChange: jest.fn(),
      saveCsv: true
    };
  });

  it('should render correctly', () => {
    const wrapper = shallow(<CollectionControls {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
