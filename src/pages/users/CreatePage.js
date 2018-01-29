import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import { Page, Panel, Button } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import RoleSelect from './components/RoleSelect';
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
      })
      .catch((err) => {
        const { response: { status, data }} = err;
        let message = 'Unable to invite user.';

        if (status === 400) {
        // Email address suppressed
          message = 'The email you tried to invite is currently suppressed by SparkPost. Please use another email address or contact support.';
        } else if (status === 409) {
        // User already exists
          message = data.errors[0].message;
        }

        showAlert({
          type: 'error',
          message
        });
      });
  };

  render() {
    const {
      submitting,
      pristine,
      handleSubmit
    } = this.props;

    return (
      <Page title="Add User" breadcrumbAction={breadcrumbAction}>
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
              <Field name="access" label="Role" component={RoleSelect} />
              <Button submit primary disabled={submitting || pristine}>
                {submitting ? 'Loading' : 'Add User' }
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
