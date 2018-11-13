import React from 'react';
import { shallow } from 'enzyme';
import DeleteSnippetModal from '../DeleteSnippetModal';

describe('DeleteSnippetModal', () => {
  const subject = (props = {}) => shallow(
    <DeleteSnippetModal {...props}>
      {({ open }) => (
        <a onClick={() => open({ id: 'test-snippet' })}>Delete</a>
      )}
    </DeleteSnippetModal>
  );

  it('renders modal and link', () => {
    expect(subject()).toMatchSnapshot();
  });

  it('renders pending modal when deleting', () => {
    const wrapper = subject({ deleting: true });
    expect(wrapper.find('DeleteModal').prop('isPending')).toEqual(true);
  });

  it('opens modal and stashes snippet when link is clicked', () => {
    const wrapper = subject();

    wrapper.find('a').simulate('click');

    expect(wrapper.state('snippet')).toEqual({ id: 'test-snippet' });
    expect(wrapper.find('DeleteModal').prop('open')).toEqual(true);
  });

  it('closes modal when cancel button is clicked', () => {
    const wrapper = subject();

    wrapper.find('a').simulate('click'); // open modal
    wrapper.find('DeleteModal').simulate('cancel');

    expect(wrapper.find('DeleteModal').prop('open')).toEqual(false);
  });

  it('calls deleteSnippet when delete button is clicked', () => {
    const deleteSnippet = jest.fn();
    const wrapper = subject({ deleteSnippet });

    wrapper.find('a').simulate('click'); // open modal
    wrapper.find('DeleteModal').simulate('delete');

    expect(deleteSnippet).toHaveBeenCalledWith({ id: 'test-snippet' });
  });

  it('closes modal and shows alert when delete suceeds', () => {
    const deleteSnippet = jest.fn();
    const showAlert = jest.fn();
    const wrapper = subject({ deleteSnippet, showAlert });

    wrapper.find('a').simulate('click'); // open modal
    wrapper.setProps({ deleting: true });
    wrapper.setProps({ deleting: false });

    expect(wrapper.find('DeleteModal').prop('open')).toEqual(false);
    expect(showAlert).toHaveBeenCalledWith({
      message: 'Deleted test-snippet snippet',
      type: 'success'
    });
  });

  it('leaves modal open when delete fails', () => {
    const deleteSnippet = jest.fn();
    const wrapper = subject({ deleteSnippet });

    wrapper.find('a').simulate('click'); // open modal
    wrapper.setProps({ deleting: true });
    wrapper.setProps({ deleting: false, error: new Error('Oh no!') });

    expect(wrapper.find('DeleteModal').prop('open')).toEqual(true);
  });
});
