/* eslint-disable */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Field, change } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper } from 'src/components';
import { required } from 'src/helpers/validation';
import Payment from 'payment';
import { formatCardTypes } from 'src/helpers/billing';

import styles from './Forms.module.scss';

/**
 * This component will register the following redux-form fields
 * card.number
 * card.type (hidden)
 * card.name
 * card.expMonth (hidden)
 * card.expYear (hidden)
 * card.expCombined
 * card.securityCode
 */
class PaymentForm extends Component {
  componentDidMount() {
    // Remove unaccepted card types and format strings for our api
    const types = Payment.getCardArray();
    Payment.setCardArray(formatCardTypes(types));

    // Format these textfields on change
    Payment.formatCardNumber(ReactDOM.findDOMNode(this.cc));
    Payment.formatCardExpiry(ReactDOM.findDOMNode(this.expiry));
    Payment.formatCardCVC(ReactDOM.findDOMNode(this.cvc));
  }

  // Splits month and year into two hidden fields
  handleExpiry = (e) => {
    const { change, formName } = this.props;
    const values = Payment.fns.cardExpiryVal(e.target.value);
    change(formName, 'card.expMonth', values.month);
    change(formName, 'card.expYear', values.year);
  }

  // Sets type from cc number into a hidden field
  handleType = (e) => {
    const { change, formName } = this.props;
    const value = Payment.fns.cardType(e.target.value);
    change(formName, 'card.type', value);
  }

  render() {
    const { disabled } = this.props;
    return (
      <div>
        <p><small>Credit Card</small></p>
        <Field
          label='Credit Card Number'
          name='card.number'
          ref={(input) => this.cc = input}
          onChange={this.handleType}
          component={TextFieldWrapper}
          validate={required}
          disabled={disabled}
        />
        <Field
          label='Cardholder Name'
          name='card.name'
          component={TextFieldWrapper}
          validate={required}
          disabled={disabled}
        />
        <Grid>
          <Grid.Column xs={6}>
            <Field
              label='Expiration Date'
              name='card.expCombined'
              ref={(input) => this.expiry = input}
              onChange={this.handleExpiry}
              placeholder='MM/YYYY'
              component={TextFieldWrapper}
              validate={required}
              disabled={disabled}
            />
          </Grid.Column>
          <Grid.Column xs={6}>
            <Field
              label='Security Code'
              name='card.securityCode'
              ref={(input) => this.cvc = input}
              placeholder='CVV/CVC'
              component={TextFieldWrapper}
              validate={required}
              disabled={disabled}
            />
          </Grid.Column>
        </Grid>

        {/* Hidden redux-form connected fields */}
        <div className={styles.hidden} >
          <Field name='card.type' component='input' tabIndex='-1' />
          <Field name='card.expMonth' component='input' tabIndex='-1'/>
          <Field name='card.expYear' component='input' tabIndex='-1'/>
        </div>
      </div>
    );
  }
}

export default connect(null, { change })(PaymentForm);
