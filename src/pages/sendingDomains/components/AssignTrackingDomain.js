import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Panel, Button } from '@sparkpost/matchbox';
import { showAlert } from 'src/actions/globalAlert';
import { SendingDomainSection } from './SendingDomainSection';
import { update as updateSendingDomain } from 'src/actions/sendingDomains';
import { listTrackingDomains } from 'src/actions/trackingDomains';
import { selectTrackingDomainsOptions } from 'src/selectors/trackingDomains';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { SelectWrapper } from 'src/components/reduxFormWrappers';

export class AssignTrackingDomain extends Component {
  componentDidMount() {
    this.props.listTrackingDomains();
  }

  updateTrackingDomain = ({ trackingDomain: tracking_domain }) => {
    const { domain: { id, subaccount_id: subaccount }, showAlert } = this.props;
    return this.props.updateSendingDomain({ id, subaccount, tracking_domain })
      .then(() => showAlert({
        type: 'success',
        message: 'Tracking domain assignment updated.'
      }))
      .catch((err) => showAlert({
        type: 'error',
        message: 'Could not update tracking domain assignment.',
        details: err.message
      }));
  };

  renderTrackingDomains() {
    const { listLoading, trackingDomains, pristine, submitting } = this.props;

    if (listLoading) {
      return <PanelLoading />;
    }

    return (
      <Panel sectioned>
        <form onSubmit={this.props.handleSubmit(this.updateTrackingDomain)}>
          <Field
            component={SelectWrapper}
            name='trackingDomain'
            options={trackingDomains}
            disabled={submitting}
            label='Linked Tracking Domain'
            helpText='Domains must be verified to be linked to a sending domain.'
          />
          <Button submit primary disabled={submitting || pristine}>
            {submitting ? 'Updating...' : 'Update Tracking Domain'}
          </Button>
        </form>
      </Panel>
    );

  }

  render() {
    return (
      <SendingDomainSection title='Select a Tracking Domain'>
        <SendingDomainSection.Left>
          <p>Link to a tracking domain to track opens, clicks, and unsubscribes.</p>
          <Link to={'/account/tracking-domains/create'}>Create a tracking domain.</Link>
        </SendingDomainSection.Left>
        <SendingDomainSection.Right>
          { this.renderTrackingDomains() }
        </SendingDomainSection.Right>
      </SendingDomainSection>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    trackingDomains: selectTrackingDomainsOptions(state, props),
    initialValues: {
      trackingDomain: props.domain.tracking_domain
    }
  };
}

const formOptions = {
  enableReinitialize: true,
  form: 'AssignTrackingDomain'
};

export default connect(mapStateToProps, { showAlert, listTrackingDomains, updateSendingDomain })(reduxForm(formOptions)(AssignTrackingDomain));
