import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Field, reduxForm } from 'redux-form';
import { Button, Grid } from '@sparkpost/matchbox';
import { TextFieldWrapper, SelectWrapper } from '../../../components/reduxFormWrappers';

const getCcYears = () => {
  const year = new Date().getFullYear();
  return _.range(year, year + 20);
};

const cardOptions = [
  { value: 'Visa', label: 'Visa' },
  { value: 'MasterCard', label: 'Master Card' },
  { value: 'AmericanExpress', label: 'American Express' },
  { value: 'Discover', label: 'Discover' }
];

const monthOptions = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

let form = (props) => {
  const { handleSubmit, backToPlans, countries, hasBilling } = props;

  return (
    <div>
      <form onSubmit={handleSubmit}>
        { !hasBilling &&
          <div>
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
                </div>
              </Grid.Column>
              <Grid.Column>
                <div>Card Details
                  <Field
                    name='cardType'
                    label='Card Type'
                    options={cardOptions}
                    component={SelectWrapper}
                  />
                  <Field
                    name='cardNumber'
                    label='Card Number'
                    placeholder='**** **** **** ****'
                    component={TextFieldWrapper}/>
                  <Field
                    name='cardHolderName'
                    label='Name on Card'
                    placeholder=''
                    component={TextFieldWrapper}/>
                  <Field
                    name='expirationMonth'
                    label='Expiration Month'
                    options={monthOptions}
                    component={SelectWrapper} />
                  <Field
                    name='expirationYear'
                    label='Expiration Year'
                    options={getCcYears()}
                    component={SelectWrapper} />
                  <Field
                    name='cvc'
                    label='CVC'
                    placeholder='***'
                    component={TextFieldWrapper} />
                </div>
              </Grid.Column>
              <Grid.Column>
                <div>Billing Address
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
                  options={countries}
                  component={SelectWrapper}/>
                </div>
              </Grid.Column>
            </Grid>
          </div> }
        <Field
          name='selectedPlan'
          type='hidden'
          component='input' />
        <Button submit primary={true}>Upgrade</Button>
        <Button onClick={backToPlans}>Back to Plans</Button>
      </form>
    </div>
  );
};

const formName = 'creditCardForm';

form = reduxForm({
  form: formName
})(form);

const mapStateToProps = (state, props) => {
  const { currentUser, selectedPlan } = props;

  return {
    initialValues: {
      cardHolderName: `${currentUser.first_name} ${currentUser.last_name}`,
      email: currentUser.email,
      firstName: currentUser.first_name,
      lastName: currentUser.last_name,
      selectedPlan: selectedPlan
    }
  };
};

const CreditCardForm = connect(mapStateToProps)(form);

export default CreditCardForm;
