import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Portal, Icon, Popover } from '@sparkpost/matchbox';
import entitledToSupport from 'src/selectors/support';
import { createTicket, clearSupportForm } from 'src/actions/support';
import SupportForm from './components/SupportForm';
import styles from './Support.module.scss';

export class Support extends Component {

  state = {
    showPanel: false
  };

  onSubmit = (values) => {
    const { createTicket } = this.props;
    const { subject, message } = values;
    const ticket = { subject, message };

    return createTicket(ticket);
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
            fixed
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

const mapStateToProps = (state) => ({
  loggedIn: state.auth.loggedIn,
  entitledToSupport: entitledToSupport(state)
});

const mapDispatchToProps = { createTicket, clearSupportForm };

export default connect(mapStateToProps, mapDispatchToProps)(Support);
