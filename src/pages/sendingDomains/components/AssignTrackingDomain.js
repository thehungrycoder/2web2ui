import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Panel, Grid, Button } from '@sparkpost/matchbox';
import { SendingDomainSection } from './SendingDomainSection';
import { update as updateSendingDomain } from 'src/actions/sendingDomains';
import { listTrackingDomains } from 'src/actions/trackingDomains';
import { selectTrackingDomainsOptions } from 'src/selectors/trackingDomains';
import PanelLoading from 'src/components/panelLoading/PanelLoading';
import { SelectWrapper } from 'src/components/reduxFormWrappers';

export class AssignTrackingDomain extends Component {
  componentDidMount() {
    if (!this.props.submitting) {
      this.props.listTrackingDomains();
    }
  }

  updateTrackingDomain = ({ trackingDomain: tracking_domain }) => {
    const { sendingDomain } = this.props;
    return this.props.updateSendingDomain(sendingDomain, { tracking_domain });
  };

  renderSection() {
    return (<Grid>
      <Grid.Column xs={12} md={6}>
        <div>Link to a tracking domain to track opens, clicks, and unsubscribes.</div>
        <Link to={'/account/tracking-domains'}>Create a tracking domain.</Link>
      </Grid.Column>
      <Grid.Column xs={12} md={6}>
        { this.renderTrackingDomains() }
      </Grid.Column>
    </Grid>);
  }

  renderTrackingDomains() {
    const { listLoading, trackingDomains, pristine, submitting } = this.props;

    if (listLoading) {
      return <PanelLoading />;
    }

    return (
      <Panel sectioned>
        <h5>Linked tracking domain</h5>
        <form onSubmit={this.props.handleSubmit(this.updateTrackingDomain)}>
          <Field
            component={SelectWrapper}
            name='trackingDomain'
            options={trackingDomains}
            disabled={submitting}
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
        { this.renderSection() }
      </SendingDomainSection>
    );

  }
}

function mapStateToProps(state, props) {
  return {
    trackingDomains: selectTrackingDomainsOptions(state),
    initialValues: {
      trackingDomain: props.trackingDomain
    }
  };
}

const formOptions = {
  form: 'AssignTrackingDomain'
};

export default connect(mapStateToProps, { listTrackingDomains, updateSendingDomain })(reduxForm(formOptions)(AssignTrackingDomain));
