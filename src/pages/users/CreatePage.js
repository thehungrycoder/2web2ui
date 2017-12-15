import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';

import { Page, Panel, Button } from '@sparkpost/matchbox';

import { TextFieldWrapper } from 'src/components';

import AccessSelect from './components/AccessSelect';

import { required, email } from 'src/helpers/validation';

import { inviteUser } from 'src/actions/users';
import { showAlert } from 'src/actions/globalAlert';

const formName = 'userForm';

const breadcrumbAction = {
  content: 'Users',
  Component: Link,
  to: '/account/users'
};


const CreatePage = (props) => {
  const {
    submitting,
    pristine,
    handleSubmit,
    inviteUser,
    showAlert,
    history
  } = props;

  const onSubmit = (values) => {
    const { email, access } = values;
    return inviteUser(email, access).then((res) => {
      showAlert({
        type: 'success',
        message: `We sent an invitation to ${email}! Once they sign up, you'll see them on this page`
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

  return (
    <Page title="Add User" breadcrumbAction={breadcrumbAction}>
      <Panel>
        <Panel.Section>
          <form onSubmit={handleSubmit(onSubmit)}>
            <p>An invitation will be sent to the email address you supply</p>
            <Field
              name="email"
              validate={[required, email]}
              label="Email address"
              component={TextFieldWrapper}
            />
            <Field name="access" label="Role" component={AccessSelect} />
            <Button submit primary disabled={submitting || pristine}>
              {submitting ? 'Loading' : 'Add User' }
            </Button>
          </form>
        </Panel.Section>
      </Panel>
    </Page>
  );
};

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
