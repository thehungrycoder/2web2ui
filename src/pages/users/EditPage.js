import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { Page, Panel, Button } from '@sparkpost/matchbox';
import { CheckboxWrapper } from 'src/components/reduxFormWrappers';
import RoleSelect from './components/RoleSelect';

const breadcrumbAction = {
  content: 'Users',
  Component: Link,
  to: '/account/users'
};

export class EditPage extends Component {

  render() {

    const secondaryActions = [{ content: 'Delete' }];

    return <Page
      title={'appteam'}
      breadcrumbAction={breadcrumbAction}
      secondaryActions={secondaryActions}>
      <Panel>
        <form>
          <Panel.Section>
            <Field
              name='access'
              component={RoleSelect}
              label='Role'
            />
          </Panel.Section>
          <Panel.Section>
            <Field
              name='is_sso'
              label='Enable single sign-on authentication for this user'
              component={CheckboxWrapper}
            />
          </Panel.Section>
          <Panel.Section>
            <Button submit primary>Update user</Button>
          </Panel.Section>
        </form>
      </Panel>
    </Page>;
  }
}

export default connect(() => ({}), {})(reduxForm({ form: 'userEditForm' })(EditPage));
