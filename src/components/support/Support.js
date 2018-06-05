import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import qs from 'query-string';
import { Panel, Tabs } from '@sparkpost/matchbox';
import * as supportActions from 'src/actions/support';
import { AccessControl } from 'src/components/auth';
import Modal from 'src/components/modals/Modal';
import { authorizedToSubmitSupportTickets } from 'src/selectors/support';
import SearchPanel from './components/SearchPanel';
import SupportContact from './components/SupportContact';
import SupportForm from './components/SupportForm';

import styles from './Support.module.scss';

export class Support extends Component {
  componentDidMount() {
    this.maybeOpenTicket();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;

    if (location.search && location.search !== prevProps.location.search) {
      this.maybeOpenTicket();
    }
  }

  // Opens and hydrates support ticket form from query params
  maybeOpenTicket = () => {
    const { location, openSupportTicketForm } = this.props;
    const { supportTicket, supportMessage: message, supportIssue: issueId } = qs.parse(location.search);

    if (supportTicket) {
      openSupportTicketForm({ issueId, message });
    }
  }

  openSupportPanel = (view) => () => {
    this.props.openSupportPanel({ view });
  }

  render() {
    const { authorizedToSubmitSupportTickets, closeSupportPanel, currentSupportView, loggedIn, showSupportPanel } = this.props;
    const tabs = [
      { content: 'Search Help', onClick: this.openSupportPanel('docs'), view: 'docs' },
      { content: 'Submit A Ticket', onClick: this.openSupportPanel('ticket'), view: 'ticket' },
      { content: 'Contact Us', onClick: this.openSupportPanel('contact'), view: 'contact' }
    ];
    const selectedTabIndex = tabs.findIndex((tab) => tab.view === currentSupportView);

    if (!loggedIn) {
      return null;
    }

    return (
      <AccessControl condition={() => true}>
        <Modal open={showSupportPanel} onClose={closeSupportPanel}>
          {authorizedToSubmitSupportTickets && (
            <Tabs connectBelow={true} selected={selectedTabIndex} tabs={tabs} />
          )}
          <Panel className={styles.Support}>
            {currentSupportView === 'docs' && <SearchPanel />}
            {currentSupportView === 'ticket' && <SupportForm onClose={closeSupportPanel} />}
            {currentSupportView === 'contact' && <SupportContact />}
          </Panel>
        </Modal>
      </AccessControl>
    );
  }
}

const mapStateToProps = (state) => ({
  authorizedToSubmitSupportTickets: authorizedToSubmitSupportTickets(state),
  currentSupportView: state.support.currentView,
  loggedIn: state.auth.loggedIn,
  showSupportPanel: state.support.showPanel
});

export default withRouter(connect(mapStateToProps, supportActions)(Support));
