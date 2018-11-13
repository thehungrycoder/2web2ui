import React from 'react';
import { DeleteModal } from 'src/components/modals';

export default class DeleteSnippetModal extends React.Component {
  state = {
    isOpen: false,
    wasDeleted: false
  }

  componentDidUpdate(prevProps) {
    const { snippet } = this.state;

    if (prevProps.deleting && !this.props.deleting && !this.props.error) {
      this.props.showAlert({ type: 'success', message: `Deleted ${snippet.id} snippet` });
      this.setState({ isOpen: false, snippet: undefined, wasDeleted: true });
    }
  }

  handleClose = () => {
    this.setState({ isOpen: false, snippet: undefined });
  }

  handleDelete = () => {
    this.props.deleteSnippet(this.state.snippet);
  }

  handleOpen = (snippet) => {
    this.setState({ isOpen: true, snippet, wasDeleted: false });
  }

  render() {
    const { children, deleting } = this.props;
    const { isOpen, wasDeleted } = this.state;

    return (
      <React.Fragment>
        {children({ open: this.handleOpen, wasDeleted })}
        <DeleteModal
          isPending={deleting}
          onCancel={this.handleClose}
          onDelete={this.handleDelete}
          open={isOpen}
          title="Are you sure you want to delete this snippet?"
        >
          <p>
            The snippet will be immediately and permanently removed. All substitution references
            will need to be manually removed from templates.
          </p>
        </DeleteModal>
      </React.Fragment>
    );
  }
}
