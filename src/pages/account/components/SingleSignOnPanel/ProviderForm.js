import React from 'react';
import { connect } from 'react-redux';
import { Field, Form, reduxForm } from 'redux-form';
import { Button, Panel } from '@sparkpost/matchbox';
import {
  provisionAccountSingleSignOn,
  reprovisionAccountSingleSignOn
} from 'src/actions/accountSingleSignOn';
import { showAlert } from 'src/actions/globalAlert';
import CopyField from 'src/components/copyField/CopyField';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import config from 'src/config';
import { getBase64Contents } from 'src/helpers/file';
import { fileExtension, maxFileSize, required } from 'src/helpers/validation';
import styles from './ProviderForm.module.scss';

export class ProviderForm extends React.Component {
  cancel = () => {
    this.props.onCancel();
  };

  submit = async ({ samlFile }) => {
    const {
      provider,
      provisionAccountSingleSignOn,
      reprovisionAccountSingleSignOn,
      showAlert
    } = this.props;
    const samlContents = await getBase64Contents(samlFile);
    const action = provider ? reprovisionAccountSingleSignOn : provisionAccountSingleSignOn;

    return action(samlContents)
      .then(() => {
        showAlert({ type: 'success', message: 'Successfully provisioned SAML' });
      });
  };

  componentDidUpdate(prevProps) {
    const { onSubmit, updatedAt } = this.props;

    if (updatedAt !== prevProps.updatedAt) {
      onSubmit();
    }
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <Form onSubmit={handleSubmit(this.submit)}>
        <Panel title="Provision Single Sign-On" accent>
          <Panel.Section className={styles.step}>
            <h6>Step 1: Setup Callback URL</h6>
            <p>
              To complete setup with your Identity Provider (IdP), you will need to provide the
              following callback URL.
            </p>
            <div>
              <CopyField value={`${config.apiBase}/v1/users/saml/consume`} />
            </div>
          </Panel.Section>
          <Panel.Section className={styles.step}>
            <h6>Step 2: Upload your Security Assertion Markup Language (SAML)</h6>
            <p>
              This is a configuration file that can be downloaded from your IdP.
            </p>
            <div>
              <Field
                component={FileFieldWrapper}
                disabled={submitting}
                filetype="xml"
                helpText={`
                  If you already provided a file, reprovisioning will replace your current
                  configuration.
                `}
                name="samlFile"
                type="file"
                validate={[required, fileExtension('xml'), maxFileSize(config.apiRequestBodyMaxSizeBytes)]}
              />
            </div>
          </Panel.Section>
          <Panel.Section>
            <Button primary disabled={submitting} type="submit">Provision SSO</Button>
            <Button className={styles.cancel} onClick={this.cancel}>Cancel</Button>
          </Panel.Section>
        </Panel>
      </Form>
    );
  }
}


const mapDispatchToProps = {
  provisionAccountSingleSignOn,
  reprovisionAccountSingleSignOn,
  showAlert
};

const mapStateToProps = ({ accountSingleSignOn }) => accountSingleSignOn;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({ form: 'provisionAccountSignleSignOn' })(ProviderForm));
