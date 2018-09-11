import React from 'react';
import { connect } from 'react-redux';
import { Field, Form, reduxForm } from 'redux-form';
import { Button, Panel } from '@sparkpost/matchbox';
import {
  provisionAccountSingleSignOn,
  reprovisionAccountSingleSignOn
} from 'src/actions/accountSingleSignOn';
import FileFieldWrapper from 'src/components/reduxFormWrappers/FileFieldWrapper';
import { getBase64Contents } from 'src/helpers/file';
import { required } from 'src/helpers/validation';
import styles from './ProviderForm.module.scss';

export class ProviderForm extends React.Component {
  cancel = () => {
    this.props.onCancel();
  };

  submit = async ({ samlFile }) => {
    const { provider, provisionAccountSingleSignOn, reprovisionAccountSingleSignOn } = this.props;
    const samlContents = await getBase64Contents(samlFile);

    if (provider) {
      reprovisionAccountSingleSignOn(samlContents);
    } else {
      provisionAccountSingleSignOn(samlContents);
    }
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
          <Panel.Section>
            <Field
              component={FileFieldWrapper}
              disabled={submitting}
              filetype="xml"
              label='Upload a Security Assertion Markup Language (SAML) metadata file.'
              helpText={`
                This is an XML file provided by your Identity Provider.  If you already
                provided a file, reprovisioning will replace your current configuration.
              `}
              name="samlFile"
              type="file"
              validate={required}
            />
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
  reprovisionAccountSingleSignOn
};

const mapStateToProps = ({ accountSingleSignOn }) => accountSingleSignOn;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(reduxForm({ form: 'provisionAccountSignleSignOn' })(ProviderForm));
