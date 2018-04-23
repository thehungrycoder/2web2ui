import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import qs from 'query-string';
import { Portal, Icon, Popover } from '@sparkpost/matchbox';
import { entitledToSupport } from 'src/selectors/support';
import * as supportActions from 'src/actions/support';
import SupportForm from './components/SupportForm';
import { SearchPanel } from './components/SearchPanel';
import styles from './Support.module.scss';

export class Support extends Component {
  componentDidMount() {
    this.maybeOpenTicket();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.maybeOpenTicket();
    }
  }

  // Opens and hydrates support ticket form from query params
  maybeOpenTicket = () => {
    const { location, toggleSupportPanel, toggleTicketForm, hydrateTicketForm } = this.props;
    const { supportTicket, supportMessage: message, supportSubject: subject } = qs.parse(location.search);

    if (supportTicket) {
      toggleSupportPanel();
      toggleTicketForm();
      hydrateTicketForm({ message, subject });
    }
  }

  onSubmit = (values) => {
    const { createTicket } = this.props;
    const { subject, message } = values;
    const ticket = { subject, message };

    return createTicket(ticket);
  };

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

  renderPanel() {
    const { showTicketForm } = this.props;

    return showTicketForm
      ? <SupportForm
        onSubmit={this.onSubmit}
        onCancel={this.toggleForm}
        onContinue={this.toggleForm} />
      : <SearchPanel toggleForm={this.toggleForm} />;
  }

  render() {
    const { loggedIn, entitledToSupport, showPanel } = this.props;

    if (!loggedIn || !entitledToSupport) {
      return null;
    }

    const triggerMarkup = (
      <a className={styles.Button} onClick={this.togglePanel}>
        <Icon name={showPanel ? 'CloseCircle' : 'HelpOutline'} className={styles.Icon} size={33} />
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

            { this.renderPanel() }

          </Popover>
        </div>
      </Portal>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.auth.loggedIn,
  entitledToSupport: entitledToSupport(state),
  showPanel: state.support.showPanel,
  showTicketForm: state.support.showTicketForm
});

export default withRouter(connect(mapStateToProps, supportActions)(Support));
