import React from 'react';
import { shallow } from 'enzyme';
import ConfirmationModal from '../ConfirmationModal';
// import { Button } from '@sparkpost/matchbox';

describe('Component: ConfirmationModal', () => {

  let onCancelMock;
  let onConfirmMock;

  beforeEach(() => {
    onCancelMock = jest.fn();
    onConfirmMock = jest.fn();
  });

  it('should render correctly with basic props', () => {
    const wrapper = shallow(<ConfirmationModal onCancel={onCancelMock} onConfirm={onConfirmMock} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render correctly with open, content, title and custom verb', () => {
    const wrapper = shallow(<ConfirmationModal
      open={true}
      onCancel={onCancelMock}
      onConfirm={onConfirmMock}
      title='Confirmation Modal Test Title'
      content={<p>Some JSX content for the modal</p>}
      confirmVerb='DESTROY'
    />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should cancel', () => {
    const wrapper = shallow(<ConfirmationModal
      onCancel={onCancelMock}
      onConfirm={onConfirmMock}
      title='Confirmation Modal Test Title'
      content={<p>Some JSX content for the modal</p>}
      confirmVerb='DESTROY'
    />);
    wrapper.find('Button').at(1).simulate('click');
    expect(onCancelMock).toHaveBeenCalledTimes(1);
    expect(onConfirmMock).not.toHaveBeenCalled();
  });

  it('should confirm', () => {
    const wrapper = shallow(<ConfirmationModal
      onCancel={onCancelMock}
      onConfirm={onConfirmMock}
      title='Confirmation Modal Test Title'
      content={<p>Some JSX content for the modal</p>}
      confirmVerb='DESTROY'
    />);
    wrapper.find('Button').at(0).simulate('click');
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
    expect(onCancelMock).not.toHaveBeenCalled();
  });

});
