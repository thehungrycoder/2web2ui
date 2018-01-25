import React, { Component } from 'react';
import { Field } from 'redux-form';
import { Link } from 'react-router-dom';

import { Panel, Grid, Banner, Button } from '@sparkpost/matchbox';
import ToggleBlock from 'src/pages/templates/components/ToggleBlock';
import { SendingDomainSection } from './SendingDomainSection';
import { resolveReadyFor } from 'src/helpers/domains';
import config from 'src/config';
import styles from './EditBounce.module.scss';

export class EditBounce extends Component {

  renderRootDomainWarning() {
    const { name } = this.props;
    const host = name.split('.');
    if (host.length >= 3) {
      return null;
    }

    return (
      <Grid>
        <Grid.Column xs={12} md={12}>
          <Banner status="warning">
            We strongly recommend using a subdomain such as <strong>bounces.{name}</strong> for bounce domains. <Link to={'/account/sending-domains/create'}>Create a new domain now.</Link>
          </Banner>
        </Grid.Column>
      </Grid>
    );
  }

  renderNotReady() {
    const { name } = this.props;
    return (<Grid>
      <Grid.Column xs={12} md={5}>
        <div>
          <p><strong>To use this domain for bounces</strong>, add this CNAME record to your DNS settings.</p>
          <p><em>Note: Bounce domains must be verified via DNS.</em></p>
        </div>
      </Grid.Column>
      <Grid.Column xs={12} md={7}>
        <Panel sectioned>
          <Grid>
            <Grid.Column xs={12} md={2}>
              <strong>Type</strong>
            </Grid.Column>
            <Grid.Column xs={12} md={4}>
              <strong>Hostname</strong>
            </Grid.Column>
            <Grid.Column xs={12} md={6}>
              <strong>Value</strong>
            </Grid.Column>
          </Grid>
          <div className={styles.GridSpacer} />
          <Grid>
            <Grid.Column xs={12} md={2}>
              <p>CNAME</p>
            </Grid.Column>
            <Grid.Column xs={12} md={4}>
              <p>{ name }</p>
            </Grid.Column>
            <Grid.Column xs={12} md={6}>
              <p>{ config.bounceDomains.cnameValue }</p>
            </Grid.Column>
          </Grid>

          <Grid>
            <Grid.Column xs={12} md={12} className={styles.Center}>
              <Button >Verify CNAME Record</Button>
            </Grid.Column>
          </Grid>
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
        <Panel sectioned>
          <Field
            name='options.open_tracking'
            component={ToggleBlock}
            label='Use this domain as your default bounce domain?'
            type='checkbox'
            parse={(value) => !!value} // Prevents unchecked value from equaling ""
            disabled={false}
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
