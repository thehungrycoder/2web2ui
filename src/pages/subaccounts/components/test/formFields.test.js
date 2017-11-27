import React from 'react';
import { shallow } from 'enzyme';
import {
  NameField,
  ApiKeyCheckBox,
  ApiKeyFields,
  IpPoolSelect,
  StatusSelect
} from '../formFields.js';

test('NameField', () => {
  const wrapper = shallow(<NameField disabled={false}/>);
  expect(wrapper).toMatchSnapshot();

  wrapper.setProps({ disabled: true });
  expect(wrapper).toMatchSnapshot();
});

test('ApiKeyCheckBox', () => {
  const wrapper = shallow(<ApiKeyCheckBox disabled={false} createApiKey={true}/>);
  expect(wrapper).toMatchSnapshot();

  wrapper.setProps({ createApiKey: false });
  expect(wrapper).toMatchSnapshot();
});

test('ApiKeyFields', () => {
  const props = {
    show: true,
    showGrants: true,
    grants: ['l0L'],
    disabled: false
  };

  const wrapper = shallow(<ApiKeyFields show={false}/>);
  expect(wrapper).toMatchSnapshot();

  wrapper.setProps(props);
  expect(wrapper).toMatchSnapshot();
});

test('StatusSelect', () => {
  const wrapper = shallow(<StatusSelect disabled={false} compliance={'active'}/>);
  expect(wrapper).toMatchSnapshot();

  wrapper.setProps({ disable: false, compliance: 'suspended' });
  expect(wrapper).toMatchSnapshot();

  wrapper.setProps({ disable: true, compliance: 'terminated' });
  expect(wrapper).toMatchSnapshot();
});

test('IpPoolSelect', () => {
  const ipMans = [
    { id: 'drake', name: 'Mine\'s just bigger is all' },
    { id: 'kanye', name: 'Still nice' }
  ];
  const wrapper = shallow(<IpPoolSelect disabled={false} ipPools={ipMans}/>);

  expect(wrapper).toMatchSnapshot();
});
