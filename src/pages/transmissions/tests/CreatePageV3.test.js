import React from 'react';
import { shallow } from 'enzyme';
import CreatePageV3 from '../CreatePageV3'; // note, not the container

describe('CreatePageV3', () => {
  const subject = (props = {}) => shallow(
    <CreatePageV3
      listTemplates={jest.fn()}
      sending={true}
      sentTo={[]}
      templates={[{ id: 'example-template', name: 'Example Template' }]}
      {...props}
    />
  );

  it('renders transmission form', () => {
    const wrapper = subject();
    expect(wrapper).toMatchSnapshot();
  });

  it('renders disabled transmission form when sending', () => {
    const wrapper = subject({ sending: true });
    expect(wrapper).toMatchSnapshot();
  });

  it('calls .sendTransmission onSubmit', async () => {
    const sendTransmission = jest.fn();
    const state = {
      recipient: 'me@example.com',
      template: 'example-template'
    };
    const wrapper = subject({ sendTransmission });

    wrapper.setState(state);
    wrapper.prop('primaryAction').onClick();

    expect(sendTransmission).toHaveBeenCalledWith(state);
  });
});
