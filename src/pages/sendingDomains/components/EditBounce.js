import React, { Component } from 'react';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { verify, update } from 'src/actions/sendingDomains';

import { Panel, Grid, Banner } from '@sparkpost/matchbox';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';
import { showAlert } from 'src/actions/globalAlert';
import { SendingDomainSection } from './SendingDomainSection';
import { resolveReadyFor } from 'src/helpers/domains';
import SimpleTable from './SimpleTable';
import config from 'src/config';

export class EditBounce extends Component {

  verifyDomain = () => {
    const { id, verify, showAlert } = this.props;
    return verify(id, 'cname')
      .then((results) => {
        const readyFor = resolveReadyFor(results);
        if (readyFor.bounce) {
          showAlert({ type: 'success', message: `You have successfully verified CNAME record of ${id}` });
        } else {
          showAlert({ type: 'error', message: `Unable to verify CNAME record of ${id}. ${results.dns.cname_error}` });
        }
      })
      .catch((err) => {
        showAlert({ type: 'error', message: `Unable to verify CNAME record of ${id}. ${err.message}` });
      });
  }

  toggleDefaultBounce = () => {
    const { id, update, domain, showAlert } = this.props;

    return update(id, {
      is_default_bounce_domain: !domain.is_default_bounce_domain
    })
      .catch((err) => {
        showAlert({ type: 'error', message: `Failed to update default bounce option. ${err.message}` });
      });
  }

  renderRootDomainWarning() {
    const { id } = this.props;
    const host = id.split('.');
    if (host.length >= 3) {
      return null;
    }

    return (
      <Grid>
        <Grid.Column xs={12} md={12}>
          <Banner status="warning">
            We strongly recommend using a subdomain such as <strong>bounces.{id}</strong> for bounce domains. <Link to={'/account/sending-domains/create'}>Create a new domain now.</Link>
          </Banner>
        </Grid.Column>
      </Grid>
    );
  }

  renderNotReady() {
    const { id } = this.props;
    return (<Grid>
      <Grid.Column xs={12} md={5}>
        <div>
          <p><strong>To use this domain for bounces</strong>, add this CNAME record to your DNS settings.</p>
          <p><em>Note: Bounce domains must be verified via DNS.</em></p>
        </div>
      </Grid.Column>
      <Grid.Column xs={12} md={7}>
        <Panel>
          <Panel
            title='DNS Settings'
            actions={[{ content: 'Verify CNAME Record', onClick: this.verifyDomain }]}
          >
            <SimpleTable
              header={['Type', 'Hostname', 'Value']}
              rows={[['CNAME', id, config.bounceDomains.cnameValue]]}
            />
          </Panel>
        </Panel>
      </Grid.Column>
    </Grid>);
  }

  renderReady() {
    return (<Grid>
      <Grid.Column xs={12} md={6}>
        <div>This domain is all set up and ready to be used as a bounce domain. Such alignment, wow!</div>
      </Grid.Column>
      <Grid.Column xs={12} md={6}>
        <Panel sectioned>
          <div>Your domain is ready to be used as a bounce domain.</div>
        </Panel>
        <Panel sectioned
        >
          <Field
            name='is_default_bounce_domain'
            component={ToggleBlock}
            label='Use this domain as your default bounce domain?'
            type='checkbox'
            parse={(value) => !!value} // Prevents unchecked value from equaling ""
            disabled={false}
            onChange={this.toggleDefaultBounce}
          />
        </Panel>
      </Grid.Column>
    </Grid>);
  }

  render() {
    const { domain } = this.props;
    const readyFor = resolveReadyFor(domain.status);
    return (
      <SendingDomainSection title='Set Up For Bounce'>
        { this.renderRootDomainWarning() }
        { readyFor.bounce ? this.renderReady() : this.renderNotReady() }
      </SendingDomainSection>
    );
  }
}



const formOptions = {
  form: 'sendingDomainBounce',
  enableReinitialize: true // required to update initial values from redux state
};

export default connect(null, { verify, update, showAlert })(reduxForm(formOptions)(EditBounce));
