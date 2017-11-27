import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Portal, Icon, Popover } from '@sparkpost/matchbox';

import { createTicket, clearSupportForm } from 'src/actions/support';
import { showAlert } from 'src/actions/globalAlert';
import SupportForm from './components/SupportForm';

import styles from './Support.module.scss';

class Support extends Component {

  state = {
    showPanel: false
  };

  onSubmit = (values) => {
    const { createTicket, showAlert } = this.props;
    const { subject, message } = values;
    const ticket = { subject, message };
    return createTicket(ticket).catch((err) => {
      showAlert({
        type: 'error',
        message: 'We were unable to submit your ticket. Please try again.'
      });
      throw err;
    });
  };

  togglePanel = () => {
    this.setState({ showPanel: !this.state.showPanel });
  }

  resetPanel = () => {
    this.setState({ showPanel: false }, () => {
      this.props.clearSupportForm();
    });
  };

  render() {
    const {
      loggedIn
    } = this.props;

    if (!loggedIn) {
      return null;
    }

    const triggerMarkup = (
      <a className={styles.Button} onClick={this.togglePanel}>
        <Icon name='HelpOutline' className={styles.Icon} size={33} />
      </a>
    );

    return (
      <Portal containerId='support-portal'>
        <div className={styles.Support}>
          <Popover
            top
            left
            style={{ width: '500px', height: '475px' }}
            manualTrigger
            open={this.state.showPanel}
            trigger={triggerMarkup}>

            <SupportForm onSubmit={this.onSubmit} onCancel={this.resetPanel} onContinue={this.resetPanel} />

          </Popover>
        </div>
      </Portal>
    );
  }
}

const mapStateToProps = ({ auth, support }) => ({
  loggedIn: auth.loggedIn,
  ticketId: support.ticketId
});

const mapDispatchToProps = { createTicket, clearSupportForm, showAlert };

export default connect(mapStateToProps, mapDispatchToProps)(Support);
