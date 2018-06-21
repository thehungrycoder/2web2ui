import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';

import { getRecipientList, updateRecipientList } from 'src/actions/recipientLists';
import { Button, Panel } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { email, maxLength, required } from 'src/helpers/validation';
import { showAlert } from '../../../actions/globalAlert';

const formName = 'recipientListAddRecipientForm';

export class RecipientListAddRecipientForm extends Component {
  addRecipient = (values) => {
    const newRecipient = {
      address: values
    };

    return this.props.getRecipientList(this.props.list.id)
      .then((list) => {
        const recipients = _.compact(_.map(list.recipients, (recipient) => {
          if (!recipient.return_path) {
            return _.omit(recipient, ['return_path']);
          } else {
            return recipient;
          }
        }));

        recipients.push(newRecipient);
        return {
          ...list,
          recipients
        };
      })
      .then((newList) => this.props.updateRecipientList(newList))
      .then(() => {
        this.props.showAlert({
          type: 'success',
          message: `Recipient ${values.email} is added to from ${this.props.list.name}`
        });
      })
      .then(() => this.props.getRecipientList(this.props.list.id));
  };


  render() {
    const { pristine, valid, error, submitting, handleSubmit } = this.props;

    const submitDisabled = pristine || !valid || submitting;


    return <div>
      {error && this.renderCsvErrors()}
      <form onSubmit={handleSubmit(this.addRecipient)}>
        <Panel>
          <Panel.Section>
            <Field
              name='name'
              label='Recipient Name'
              placeholder='Recipient Name'
              validate={[required, maxLength(64)]}
              disabled={submitting}
              component={TextFieldWrapper}
              required
            />
            <Field
              name='email'
              label='Recipient Email'
              placeholder='Recipient Email'
              validate={[required, maxLength(64), email]}
              disabled={submitting}
              component={TextFieldWrapper}
              required
            />
          </Panel.Section>
          <Panel.Section>
            <Button primary submit disabled={submitDisabled}>Add Recipient</Button>
          </Panel.Section>
        </Panel>
      </form>
    </div>;
  }
}

const mapDispatchToProps = {
  getRecipientList,
  updateRecipientList,
  showAlert
};

const WrappedForm = reduxForm({ form: formName })(RecipientListAddRecipientForm);

const mapStateToProps = (state, props) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(WrappedForm);
