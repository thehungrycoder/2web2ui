import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Portal, Icon, Popover } from '@sparkpost/matchbox';

import { fetch as fetchAccount } from 'src/actions/account';

import { createTicket, clearSupportForm } from 'src/actions/support';
import { showAlert } from 'src/actions/globalAlert';
import SupportForm from './components/SupportForm';

import styles from './Support.module.scss';

export class Support extends Component {

  state = {
    showPanel: false
  };

  componentWillMount() {
    this.props.fetchAccount();
  }

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
    const { loggedIn, entitledToSupport } = this.props;
    const { showPanel } = this.state;

    if (!loggedIn || !entitledToSupport) {
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
            manualTrigger
            className={styles.Popover}
            open={showPanel}
            trigger={triggerMarkup}>

            <SupportForm
              onSubmit={this.onSubmit}
              onCancel={this.resetPanel}
              onContinue={this.resetPanel} />

          </Popover>
        </div>
      </Portal>
    );
  }
}

const mapStateToProps = ({ auth, account }) => ({
  loggedIn: auth.loggedIn,
  entitledToSupport: account.support ? account.support.online : false
});

const mapDispatchToProps = { fetchAccount, createTicket, clearSupportForm, showAlert };

export default connect(mapStateToProps, mapDispatchToProps)(Support);
