import React from 'react';
import { shallow } from 'enzyme';
import { SendingDomainsTab, getRowData } from '../SendingDomainsTab';

describe('SendingDomainsTab', () => {
  let wrapper;

  beforeEach(() => {
    const props = {
      domains: [
        {
          domain: 'foo.com'
        },
        {
          domain: 'bar.com'
        }
      ],
      loading: false
    };

    wrapper = shallow(<SendingDomainsTab {...props} />);
  });

  it('should load domains in tab', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show panel loading while loading domains', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should show empty message when 0 domains exist', () => {
    wrapper.setProps({ domains: []});
    expect(wrapper).toMatchSnapshot();
  });

  it('getRowData', () => {
    expect(getRowData({ domain: 'foo.com' })).toMatchSnapshot();
  });
});

