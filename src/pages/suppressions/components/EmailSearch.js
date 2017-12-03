import React, { Component } from 'react';
import { connect } from 'react-redux';

import { reduxForm, Field } from 'redux-form';
import { Grid, TextField } from '@sparkpost/matchbox';
import { TextFieldWrapper, FilterDropdown } from 'src/components';

import { required } from 'src/helpers/validation';

export class EmailSearch extends Component {
  state = {
    email: '',
    subaccounts: []
  };

  handleChange(e, key) {
    this.setState({ [key]: e.target.value });
  }

  handleBlur() {
    this.props.onSubmit({ email: this.state.email });
  }

  render() {
    const { handleSubmit, submitting, pristine, refresh, subaccounts = []} = this.props;
    const { email } = this.state;

    return (
    <Grid>
      <Grid.Column xs={12} md={6}>
        <div className=''>
            <TextField
              name='Email'
              onChange={(e) => this.handleChange(e, 'email')}
              onBlur={(e) => this.handleBlur(e)}
              // value={fromDate}
              placeholder='Email'
              value={email}
              />
        </div>
      </Grid.Column>
      <Grid.Column xs={12} md={6}>
        <div className=''>
            <FilterDropdown
                formName='emailSearchForm'
                options={subaccounts}
                namespace='subaccounts'
                displayValue='Subaccount'
            />
        </div>
      </Grid.Column>
    </Grid>
    );
  }
}

// const formName = 'emailSearchForm';

// EmailSearch = reduxForm({
//   form: formName
// })(EmailSearch);

// export default connect(null)(EmailSearch);
export default connect(null, { })(EmailSearch);
