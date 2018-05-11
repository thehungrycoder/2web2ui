import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import qs from 'query-string';
import { Portal, Popover } from '@sparkpost/matchbox';
import { Cancel, Help } from '@sparkpost/matchbox-icons';
import * as supportActions from 'src/actions/support';
import SupportForm from './components/SupportForm';
import SearchPanel from './components/SearchPanel';
import styles from './Support.module.scss';

export class Support extends Component {
  componentDidMount () {
    this.maybeOpenTicket();
  }

  componentDidUpdate (prevProps) {
    const { location } = this.props;

    if (location.search && location.search !== prevProps.location.search) {
      this.maybeOpenTicket();
    }
  }

  // Opens and hydrates support ticket form from query params
  maybeOpenTicket = () => {
    const { location, openSupportPanel, hydrateTicketForm } = this.props;
    const { supportTicket, supportMessage: message, supportIssue: issueId } = qs.parse(location.search);

    if (supportTicket) {
      openSupportPanel({ view: 'ticket' });
      hydrateTicketForm({ issueId, message });
    }
  }

  togglePanel = () => {
    const { showPanel, showTicketForm, toggleSupportPanel, toggleTicketForm } = this.props;

    // handling reseting doc search when closed
    if (!showPanel && showTicketForm) {
      toggleTicketForm();
    }
    toggleSupportPanel();
  }

  toggleForm = () => {
    this.props.toggleTicketForm();
  }

  render () {
    const { loggedIn, showPanel, showTicketForm } = this.props;

    if (!loggedIn) {
      return null;
    }

    const Icon = showPanel ? Cancel : Help;

    const triggerMarkup = (
      <a className={styles.Button} onClick={this.togglePanel}>
        <Icon className={styles.Icon} size={33} />
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
            trigger={triggerMarkup}
          >
            {showPanel && (showTicketForm
              ? <SupportForm onCancel={this.toggleForm} onContinue={this.toggleForm} />
              : <SearchPanel toggleForm={this.toggleForm} />)}
          </Popover>
        </div>
      </Portal>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.auth.loggedIn,
  showPanel: state.support.showPanel,
  showTicketForm: state.support.showTicketForm
});

export default withRouter(connect(mapStateToProps, supportActions)(Support));
