import React, { Component, Fragment } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { verifyCname, update } from 'src/actions/sendingDomains';

import { VerifiedIcon } from './Icons';
import { Panel, Banner, Tooltip, Icon } from '@sparkpost/matchbox';
import ToggleBlock from 'src/components/toggleBlock/ToggleBlock';
import { LabelledValue } from 'src/components';
import { showAlert } from 'src/actions/globalAlert';
import { SendingDomainSection } from './SendingDomainSection';
import { resolveReadyFor } from 'src/helpers/domains';
import config from 'src/config';

export class EditBounce extends Component {

  verifyDomain = () => {
    const { id, verifyCname, showAlert, domain: { subaccount_id: subaccount }} = this.props;

    return verifyCname({ id, subaccount })
      .then((results) => {
        const readyFor = resolveReadyFor(results);
        if (readyFor.bounce) {
          showAlert({ type: 'success', message: `You have successfully verified CNAME record of ${id}` });
        } else {
          showAlert({ type: 'error', message: `Unable to verify CNAME record of ${id}. ${results.dns.cname_error}` });
        }
      });
  }

  toggleDefaultBounce = () => {
    const { id, update, domain, reset } = this.props;

    return update({
      id,
      subaccount: domain.subaccount_id,
      is_default_bounce_domain: !domain.is_default_bounce_domain
    }).catch((err) => {
      // TODO: Switch this single field form to use ToggleBlock without Redux Form and set the value
      //   of the toggle from the store value, so this catch can be removed
      reset();
      throw err; // for error reporting
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

  getVerifyAction() {
    const { verifyCnameLoading } = this.props;
    const buttonText = verifyCnameLoading ? 'Verifying...' : 'Verify CNAME Record';

    return {
      content: buttonText,
      onClick: this.verifyDomain,
      disabled: verifyCnameLoading
    };
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
            actions={[this.getVerifyAction()]} >
            <LabelledValue label='Type'><p>CNAME</p></LabelledValue>
            <LabelledValue label='Hostname'><p>{id}</p></LabelledValue>
            <LabelledValue label='Value'><p>{config.bounceDomains.cnameValue}</p></LabelledValue>
          </Panel>
        </SendingDomainSection.Right>
      </Fragment>
    );
  }

  renderReady() {
    const { updateLoading, id, domain } = this.props;
    const readyFor = resolveReadyFor(domain.status);
    const defaultBounceText = domain.subaccount_id ? `Default bounce domain for subaccount ${domain.subaccount_id}?` : 'Use this domain as your default bounce domain?';

    // Allow default bounce toggle if:
    // Config flag is true
    // Domain is verified
    // Domain is ready for bounce
    // Bounce domain by subaccount config flag is true
    const showDefaultBounceSubaccount = (!domain.subaccount_id || domain.subaccount_id && config.bounceDomains.allowSubaccountDefault);
    const showDefaultBounceToggle = config.bounceDomains.allowDefault && readyFor.sending && readyFor.bounce && showDefaultBounceSubaccount;

    const tooltip = (
      <Tooltip dark content={`When this is set to "ON", all future transmissions will use ${id} as their bounce domain (unless otherwise specified).`}>{defaultBounceText}<Icon name='Help' size={15}/></Tooltip>
    );

    return (
      <Fragment>
        <SendingDomainSection.Left/>
        <SendingDomainSection.Right>
          { this.renderRootDomainWarning() }
          <Panel sectioned>
            <p><VerifiedIcon/> This domain is ready to be used as a bounce domain.</p>
          </Panel>
          { showDefaultBounceToggle &&
              <Panel sectioned>
                <Field
                  name='is_default_bounce_domain'
                  component={ToggleBlock}
                  label={tooltip}
                  type='checkbox'
                  parse={(value) => !!value} // Prevents unchecked value from equaling ""
                  disabled={updateLoading}
                  onChange={this.toggleDefaultBounce}
                />
              </Panel>
          }
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
  verifyCnameLoading: sendingDomains.verifyCnameLoading,
  initialValues: {
    ...domain
  }
});

export default connect(mapStateToProps, { verifyCname, update, showAlert })(reduxForm(formOptions)(EditBounce));
