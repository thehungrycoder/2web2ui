import { shallow } from 'enzyme';
import React from 'react';
import { PoolForm } from '../PoolForm';
//import { renderRowData } from 'src/__testHelpers__';

describe('PoolForm tests', () => {
  let props;
  let wrapper;

  beforeEach(() => {
    props = {
      submitting: false,
      isNew: false,
      ips: [
        {
          external_ip: 'external',
          hostname: 'hostname'
        },
        {
          external_ip: 'external-2',
          hostname: 'hostname-2'
        }
      ],
      list: [
        {
          id: 'my-pool',
          name: 'My Pool'
        },
        {
          id: 'pool-2',
          name: 'Another Pool'
        }
      ],
      pool: { id: 'my-pool', name: 'My Pool' },
      handleSubmit: jest.fn(),
      pristine: true
    };

    wrapper = shallow(<PoolForm {...props} />);
  });

  it('should render form', () => {
    expect(wrapper).toMatchSnapshot();
  });

  it('should show help text when editing default pool', () => {
    wrapper.setProps({ pool: { id: 'default', name: 'Default' }});
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render table if pool is new', () => {
    wrapper.setProps({ isNew: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not render table if no ips exist', () => {
    wrapper.setProps({ ips: null });
    expect(wrapper).toMatchSnapshot();
  });

  it('should return a msg if there are no ips', () => {
    wrapper.setProps({ ips: []});
    expect(wrapper).toMatchSnapshot();
  });

  it('should update button text to Saving and disable button when submitting form', () => {
    wrapper.setProps({ submitting: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('should not disable button if form is not pristine or not submitting', () => {
    wrapper.setProps({ submitting: false, pristine: false });
    expect(wrapper).toMatchSnapshot();
  });

  /* TODO: fix this test, its failing, think the helper needs updated
  it('should render row properly', () => {
    const rows = wrapper.instance().getRowData('options', { external_ip: 'ext-ip', hostname: 'host' });

    expect(renderRowData(rows)).toMatchSnapshot();
  });*/
});

