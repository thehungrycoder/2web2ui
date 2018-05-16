import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Field, change } from 'redux-form';
import { Grid } from '@sparkpost/matchbox';
import _ from 'lodash';
import config from 'src/config';

import { TextFieldWrapper } from 'src/components';
import { required, minLength } from 'src/helpers/validation';
import Payment from 'payment';
import { formatCardTypes } from 'src/helpers/billing';

/**
 * This component will register the following redux-form fields
 * card.number
 * card.name
 * card.expCombined
 * card.securityCode
 */
export class PaymentForm extends Component {
  componentDidMount () {
    const types = Payment.getCardArray();
    // Formats strings for our api (the ones we accept)
    Payment.setCardArray(formatCardTypes(types));

    // Format these textfields on change
    Payment.formatCardNumber(ReactDOM.findDOMNode(this.cc));
    Payment.formatCardExpiry(ReactDOM.findDOMNode(this.expiry));
    Payment.formatCardCVC(ReactDOM.findDOMNode(this.cvc));
  }

  validateType (number) {
    const cardType = Payment.fns.cardType(number);
    const allowedCards = _.map(config.cardTypes, 'apiFormat');

    if (_.includes(allowedCards, cardType)) {
      return undefined;
    }

    return `We only accept ${allowedCards.join(', ')}`;
  }

  dateFormat = (date) => minLength(9)(date) ? 'Must be MM / YYYY' : undefined;

  render () {
    const { disabled } = this.props;
    return (
      <div>
        <p><small>Credit Card</small></p>
        <Field
          label='Credit Card Number'
          name='card.number'
          ref={(input) => this.cc = input}
          component={TextFieldWrapper}
          validate={[required, this.validateType]}
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
              placeholder='MM/YYYY'
              component={TextFieldWrapper}
              validate={[required, this.dateFormat]}
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
      </div>
    );
  }
}

export default connect(null, { change })(PaymentForm);
