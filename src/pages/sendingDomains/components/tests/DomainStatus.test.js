import React from 'react';
import { shallow } from 'enzyme';

import { DomainStatus } from '../DomainStatus';

import { domain as domainRecord } from '../../tests/helpers/domain';

describe('DomainStatus component', () => {
  it('renders correctly', () => {
    const domain = Object.assign({}, domainRecord);
    const onChange = jest.fn();
    expect(shallow(<DomainStatus domain={domain} onShareDomainChange={onChange} />)).toMatchSnapshot();
  });
});
