import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { verify, update } from 'src/actions/sendingDomains';

import { Panel, Banner, Tooltip, Icon } from '@sparkpost/matchbox';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';
import { LabelledValue } from 'src/components';
import { showAlert } from 'src/actions/globalAlert';
import { SendingDomainSection } from './SendingDomainSection';
import { resolveReadyFor } from 'src/helpers/domains';
import config from 'src/config';

export class EditBounce extends Component {

  verifyDomain = () => {
    const { id, verify, showAlert, domain: { subaccount_id: subaccount }} = this.props;
    function alertError(error) {
      showAlert({ type: 'error', message: `Unable to verify CNAME record of ${id}. ${error}` });
    }

    return verify({ id, subaccount, type: 'cname' })
      .then((results) => {
        const readyFor = resolveReadyFor(results);
        if (readyFor.bounce) {
          showAlert({ type: 'success', message: `You have successfully verified CNAME record of ${id}` });
        } else {
          alertError(results.dns.cname_error);
        }
      })
      .catch((err) => {
        alertError(err.message);
      });
  }

  toggleDefaultBounce = () => {
    const { id, update, domain, showAlert, reset } = this.props;

    return update({
      id,
      subaccount: domain.subaccount_id,
      is_default_bounce_domain: !domain.is_default_bounce_domain
    })
      .catch((err) => {
        showAlert({ type: 'error', message: `Failed to update default bounce option. ${err.message}` });
        reset();
      });
  }

  renderRootDomainWarning() {
    const { id } = this.props;
    const host = id.split('.');
    if (host.length >= 3) {
      return null;
    }

    return (
      <Banner status="warning">
        We strongly recommend using a subdomain such as <strong>bounces.{id}</strong> for bounce domains. <Link to={'/account/sending-domains/create'}>Create a new domain now.</Link>
      </Banner>
    );
  }

  renderNotReady() {
    const { id } = this.props;

    return (
      <Fragment>
        <SendingDomainSection.Left>
          <p><strong>To use this domain for bounces</strong>, add this CNAME record to your DNS settings.</p>
          <p><em>Note: Bounce domains must be verified via DNS.</em></p>
        </SendingDomainSection.Left>
        <SendingDomainSection.Right>
          { this.renderRootDomainWarning() }
          <Panel title='DNS Settings' sectioned
            actions={[{ content: 'Verify CNAME Record', onClick: this.verifyDomain }]} >
            <LabelledValue label='Type'><p>CNAME</p></LabelledValue>
            <LabelledValue label='Hostname'><p>{id}</p></LabelledValue>
            <LabelledValue label='Value'><p>{config.bounceDomains.cnameValue}</p></LabelledValue>
          </Panel>
        </SendingDomainSection.Right>
      </Fragment>
    );
  }

  renderReady() {
    const { updateLoading, id } = this.props;
    const { allowDefault } = config.bounceDomains;
    const tooltip = (
      <Tooltip dark content={`When this is set to "ON", all future transmissions will use ${id} as their bounce domain (unless otherwise specified).`}>Use this domain as your default bounce domain? <Icon name='Help' size={15}/></Tooltip>
    );

    return (
      <Fragment>
        <SendingDomainSection.Left/>
        <SendingDomainSection.Right>
          { this.renderRootDomainWarning() }
          <Panel sectioned>
            <p>This domain is ready to be used as a bounce domain.</p>
          </Panel>
          <Panel sectioned>
            { allowDefault &&
                <Field
                  name='is_default_bounce_domain'
                  component={ToggleBlock}
                  label={tooltip}
                  type='checkbox'
                  parse={(value) => !!value} // Prevents unchecked value from equaling ""
                  disabled={updateLoading}
                  onChange={this.toggleDefaultBounce}
                />
            }
          </Panel>
        </SendingDomainSection.Right>
      </Fragment>
    );
  }

  render() {
    const { domain } = this.props;

    const readyFor = resolveReadyFor(domain.status);
    return (
      <SendingDomainSection title='Set Up For Bounce'>
        { readyFor.bounce ? this.renderReady() : this.renderNotReady() }
      </SendingDomainSection>
    );
  }
}

const formOptions = {
  form: 'sendingDomainBounce',
  enableReinitialize: true // required to update initial values from redux state
};

const mapStateToProps = ({ sendingDomains }, { domain }) => ({
  updateLoading: sendingDomains.updateLoading,
  initialValues: {
    ...domain
  }
});

export default connect(mapStateToProps, { verify, update, showAlert })(reduxForm(formOptions)(EditBounce));
