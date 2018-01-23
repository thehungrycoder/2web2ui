import React from 'react';
import { shallow } from 'enzyme';

import { CreatePage } from '../CreatePage';

describe('CreatePage', () => {
  let props;

  beforeEach(() => {
    props = {
      createRecipientList: jest.fn(() => Promise.resolve()),
      showAlert: jest.fn(),
      histort: { push: jest.fn() }
    };
  });

  it('should render correctly', () => {
    expect(shallow(<CreatePage />)).toMatchSnapshot();
  });

  it('should create a recipient list', async() => {
    const wrapper = shallow(<CreatePage {...props} />);
    await wrapper.instance().createRecipientList();
    expect(props.createRecipientList).toHaveBeenCalled();
  });

  it('should show errors', async() => {
    const errorProps = {
      ...props,
      createRecipientList: jest.fn(() => Promise.reject())
    };
    const wrapper = shallow(<CreatePage {...errorProps} />);
    await wrapper.instance().createRecipientList();
    expect(props.showAlert).toBeCalledWith(expect.objectContaining({ type: 'error' }));
  });
});
