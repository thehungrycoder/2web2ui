import React, { Component } from 'react';
import { Field } from 'redux-form';

import { Panel, Grid, Banner } from '@sparkpost/matchbox';
import ToggleBlock from 'src/pages/templates/components/ToggleBlock';
import { SendingDomainSection } from './SendingDomainSection';

export class EditBounce extends Component {
  render() {
    return (
      <SendingDomainSection title='Set Up For Bounce'>
        <Grid>
          <Grid.Column xs={12} md={12}>
            <Banner status="warning">
            We strongly recommend using a subdomain such as bounces.100yearsv2.com for bounce domains. Create a new domain now.
            </Banner>
          </Grid.Column>
        </Grid>
        <Grid>
          <Grid.Column xs={12} md={6}>
          This domain is all set up and ready to be used as a bounce domain. Such alignment, wow!
          </Grid.Column>
          <Grid.Column xs={12} md={6}>
            <Panel sectioned>
              <p>Your domain is ready to be used as a bounce domain.</p>
            </Panel>
            <Panel sectioned>
              <div>
                Use this domain as your default bounce domain?
                <Field
                  name='options.open_tracking'
                  component={ToggleBlock}
                  label='O Opens'
                  type='checkbox'
                  parse={(value) => !!value} // Prevents unchecked value from equaling ""
                  disabled={false}
                />
              </div>
            </Panel>
          </Grid.Column>
        </Grid>
      </SendingDomainSection>
    );
  }
}
