import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { Page, Panel, Button } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { RadioGroup } from 'src/components/reduxFormWrappers';
import { required, email } from 'src/helpers/validation';
import { inviteUser } from 'src/actions/users';
import { showAlert } from 'src/actions/globalAlert';

const formName = 'userForm';
const breadcrumbAction = {
  content: 'Users',
  Component: Link,
  to: '/account/users'
};



export class CreatePage extends Component {

  handleSubmit = (values) => {
    const {
      inviteUser,
      showAlert,
      history
    } = this.props;
    const { email, access } = values;

    return inviteUser(email, access)
      .then(() => {
        showAlert({
          type: 'success',
          message: `Invitation sent to ${email}`
        });
        history.push('/account/users');
      });
  };

  render() {
    const {
      submitting,
      pristine,
      handleSubmit
    } = this.props;

    return (
      <Page title="Invite User" breadcrumbAction={breadcrumbAction}>
        <Panel>
          <Panel.Section>
            <form onSubmit={handleSubmit(this.handleSubmit)}>
              <p>An invitation will be sent to the email address you supply</p>
              <Field
                name="email"
                validate={[required, email]}
                label="Email address"
                component={TextFieldWrapper}
              />
              <Field
                name="access"
                title="Role"
                component={RadioGroup}
                grid={{ xs: 12, sm: 12, md: 6 }}
                options={[
                  {
                    label: <strong>Admin</strong>,
                    value: 'admin',
                    helpText: 'Has access to all functionality in the UI. Has the ability to add additional administrators and create / invite users with a role of Reporting'
                  },
                  {
                    label: <strong>Reporting</strong>,
                    value: 'reporting',
                    helpText: 'Has no access to functionality in the UI. Permissions include access to view all reports, and view all templates except being allowed to change them'
                  }
                ]}
              />
              <Button submit primary disabled={submitting || pristine}>
                {submitting ? 'Loading' : 'Add User'}
              </Button>
            </form>
          </Panel.Section>
        </Panel>
      </Page>
    );
  }

}

const mapStateToProps = () => ({
  initialValues: {
    access: 'admin' // Sadly redux-form does not reflect a select's initial value
  }
});

const mapDispatchToProps = { inviteUser, showAlert };

const ReduxCreatePage = reduxForm({ form: formName })(CreatePage);

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ReduxCreatePage)
);
