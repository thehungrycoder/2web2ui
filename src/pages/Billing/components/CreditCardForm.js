import React from 'react';
import { connect } from 'react-redux';

import { Field, reduxForm } from 'redux-form';
import { Button, Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper } from '../../../components/reduxFormWrappers';

let CreditCardForm = (props) => {
  const { handleSubmit, backToPlans } = props;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid>
          <Grid.Column>
            <div>Billing Contact
              <Field
                name='firstName'
                label='First Name'
                placeholder=''
                component={TextFieldWrapper}/>
              <Field
                name='lastName'
                label='Last Name'
                placeholder=''
                component={TextFieldWrapper}/>
              <Field
                name='email'
                label='Email'
                placeholder=''
                component={TextFieldWrapper}/>
              <Field
                name='address1'
                label='Address 1'
                placeholder=''
                component={TextFieldWrapper}/>
              <Field
                name='address2'
                label='Address 2'
                placeholder=''
                component={TextFieldWrapper}/>
              <Field
                name='city'
                label='City'
                placeholder=''
                component={TextFieldWrapper}/>
              <Field
                name='state'
                label='State'
                placeholder=''
                component={TextFieldWrapper}/>
              <Field
                name='zipCode'
                label='Zip Code'
                placeholder=''
                component={TextFieldWrapper}/>
              <Field
                name='country'
                label='Country'
                placeholder=''
                component={TextFieldWrapper}/>
            </div>
          </Grid.Column>
          <Grid.Column>
            <div>Card Details
              <Field
                name='number'
                label='Card Number'
                placeholder='**** **** **** ****'
                component={TextFieldWrapper}/>
              <Field
                name='cardName'
                label='Name on Card'
                placeholder=''
                component={TextFieldWrapper}/>
              <Field
                name='expire'
                label='Expiration Date (mm/yy)'
                placeholder='**/**'
                component={TextFieldWrapper} />
              <Field
                name='cvc'
                label='CVC'
                placeholder='***'
                component={TextFieldWrapper} />
              <Field
                name='billingId'
                type='hidden'
                component='input' />
              <Button submit primary={true}>Upgrade</Button>
              <Button onClick={backToPlans}>Back to Plans</Button>
            </div>
          </Grid.Column>
        </Grid>
      </form>
    </div>
  );
};

const formName = 'creditCardForm';

CreditCardForm = reduxForm({
  form: formName
})(CreditCardForm);

const mapStateToProps = (state, props) => {
  const { currentUser, billingId } = props;

  return {
    initialValues: {
      number: '4111111123452345',
      cardName: 'Joe Zamoe',
      email: currentUser.email,
      firstName: currentUser.first_name,
      lastName: currentUser.last_name,
      billingId: billingId
    }
  };
};

CreditCardForm = connect(mapStateToProps)(CreditCardForm);

export default CreditCardForm;
