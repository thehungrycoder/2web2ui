import React, { Component } from 'react';
import { Button, Icon, Modal, Panel } from '@sparkpost/matchbox';

// Delete button with a confirmation modal
export default class DeleteButton extends Component {
  static defaultProps = {
    disabled: false
  }

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  onCancel = () => {
    this.setState({ open: false });
  }

  onSubmit = () => {
    this.setState({ open: false }, () => {
      const { username } = this.props.user;
      this.props.onSubmit(username);
    });
  }

  onOpen = () => {
    this.setState({ open: true });
  };

  render() {
    const { disabled, user } = this.props;

    // Display nothing when disabled to match current UI style
    if (disabled) { return null; }

    return (
      <span>
        <Button plain onClick={this.onOpen}>
          <Icon name="Delete"/>
        </Button>
        <Modal open={this.state.open}>
          <Panel accent sectioned title="Delete User">
            <p>Are you sure you want to delete {user.name}?</p>
            <Button primary onClick={this.onSubmit} style={{ marginRight: '1rem' }}>
              Delete
            </Button>
            <Button onClick={this.onCancel}>Cancel</Button>
          </Panel>
        </ Modal>
      </span>
    );
  }
}
