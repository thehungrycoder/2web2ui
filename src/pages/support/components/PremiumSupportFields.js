import React, { Fragment } from 'react';
import { Field } from 'redux-form';
import { TextFieldWrapper, RadioGroup } from 'src/components';
import { required } from 'src/helpers/validation';
import { labels } from '../helpers/formHelpers';

const PremiumSupportFields = () => (
  <Fragment>
    <Field
      name='previous_sending_domains'
      label={labels.previous_sending_domains}
      component={TextFieldWrapper}
      validate={required}
    />
    <Field
      name='previous_ips'
      label={labels.previous_ips}
      component={TextFieldWrapper}
    />
    <Field
      name='acquisition_practices'
      label={labels.acquisition_practices}
      component={TextFieldWrapper}
      multiline
    />
    <Field
      name='hygiene'
      label={labels.hygiene}
      component={TextFieldWrapper}
      multiline
    />
    <Field
      name='traffic_types'
      label={labels.traffic_types}
      component={TextFieldWrapper}
      validate={required}
    />

    <Field
      name='only_dedicated'
      title={labels.only_dedicated}
      options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
      component={RadioGroup}
    />

    <Field
      name='privacy_policy'
      label={labels.privacy_policy}
      component={TextFieldWrapper}
      validate={required}
    />

    <Field
      name='website'
      label={labels.website}
      component={TextFieldWrapper}
      validate={required}
    />

    <Field
      name='sending_policy'
      label={labels.sending_policy}
      component={TextFieldWrapper}
    />

    <Field
      name='terminated_from_esp'
      title={labels.terminated_from_esp}
      options={[{ label: 'Yes', value: 'Yes' }, { label: 'No', value: 'No' }]}
      component={RadioGroup}
      validate={required}
    />

    <Field
      name='current_issues'
      label={labels.current_issues}
      component={TextFieldWrapper}
      multiline
    />
  </Fragment>
);

export default PremiumSupportFields;
