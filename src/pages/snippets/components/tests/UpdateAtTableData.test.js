import React from 'react';
import { shallow } from 'enzyme';
import UpdatedAtTableData from '../UpdatedAtTableData';

describe('UpdatedAtTableData', () => {
  it('returns created at', () => {
    const wrapper = shallow(<UpdatedAtTableData created_at="2017-08-10T14:15:16+00:00" />);
    expect(wrapper).toMatchSnapshot();
  });

  it('returns updated at', () => {
    const wrapper = shallow(
      <UpdatedAtTableData
        created_at="2017-08-10T14:15:16+00:00"
        updated_at="2017-09-10T14:15:16+00:00"
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
