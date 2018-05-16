import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { reduxForm } from 'redux-form';
import { createTicket } from 'src/actions/support';
import { showAlert } from 'src/actions/globalAlert';
import { Page, Panel, Button } from '@sparkpost/matchbox';
import PremiumSupportFields from './components/PremiumSupportFields';
import { generateMessage } from './helpers/formHelpers';

export class PremiumSupportPage extends Component {
  handleTicketCreate = (values) => this.props.createTicket({
    message: generateMessage(values),
    issueType: 'Vetting',
    subject: 'AWS Premium Vetting'
  })

  componentDidUpdate (prevProps) {
    const { submitSucceeded, showAlert, history, ticketId, createError } = this.props;

    if (!prevProps.submitSucceeded && submitSucceeded && !createError) {
      history.push('/account/billing');
      return showAlert({
        type: 'success',
        message: `Request Submitted - Ticket # ${ticketId}`,
        autoDimiss: false
      });
    }
  }

  render () {
    const { handleSubmit, submitting } = this.props;

    return (
      <Page breadcrumbAction={{ component: Link, to: '/account/billing', content: 'Back to billing' }}>
        <Panel title='Request Premium Support' sectioned accent>
          <form onSubmit={handleSubmit(this.handleTicketCreate)}>
            <PremiumSupportFields />
            <Button submit color='orange' disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </Panel>
      </Page>
    );
  }
}

const formName = 'AwsPremiumSupportForm';
const mapStateToProps = (state, props) => ({
  ticketId: state.support.ticketId,
  createError: state.support.createError
});
const formOptions = { form: formName };
export default connect(mapStateToProps, { createTicket, showAlert })(reduxForm(formOptions)(PremiumSupportPage));
