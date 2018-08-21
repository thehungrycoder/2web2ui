import React, { Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import { Panel, Grid, Button } from '@sparkpost/matchbox';
import { Add } from '@sparkpost/matchbox-icons';
import { TextFieldWrapper } from 'src/components/reduxFormWrappers';
import { TemplateTypeaheadWrapper } from 'src/components/reduxFormWrappers';
import { required, integer, minNumber, maxNumber } from 'src/helpers/validation';

import styles from './VariantsFields.module.scss';

export const PercentField = ({ namespace, ...props }) => (
  <Field
    name={`${namespace}.percent`}
    label='Percent of total'
    type='number'
    suffix='%'
    validate={[required, minNumber(1), maxNumber(100)]}
    component={TextFieldWrapper} {...props} />
);

export const SampleSizeField = ({ namespace, ...props }) => (
  <Field
    name={`${namespace}.sample_size`}
    label='Number of Recipients'
    type='number'
    validate={[required, integer, minNumber(1)]}
    component={TextFieldWrapper} {...props} />
);

/*
  If you're looking at this, refer to https://redux-form.com/7.4.2/examples/fieldarrays/
 */
export const RenderVariants = ({ fields, formValues, disabled, subaccountId }) => (
  <Panel>
    {fields.map((variant, i) => {
      const CountField = formValues.audience_selection === 'sample_size' ? SampleSizeField : PercentField;
      return (
        <Panel.Section key={i}>
          <div className={styles.RemoveWrapper}>
            <Button flat color='orange' size='small' onClick={() => fields.remove(i)} disabled={fields.length === 1}>
              Remove Variant
            </Button>
          </div>
          <h6 className={styles.SmallHeader}>Variant {i + 1}</h6>
          <Grid>
            <Grid.Column>
              <Field
                name={`${variant}.template_object`}
                component={TemplateTypeaheadWrapper}
                label='Select a template'
                placeholder='Type to search'
                validate={required}
                disabled={disabled}
                subaccountId={subaccountId}
              />
            </Grid.Column>
            <Grid.Column>
              <CountField namespace={variant} disabled={disabled} />
            </Grid.Column>
          </Grid>
        </Panel.Section>
      );
    })
    }
    <Panel.Section>
      <Button flat color='orange' onClick={() => fields.push()} disabled={fields.length >= 20}>
        <Add /> Add Another Variant
      </Button>
    </Panel.Section>
  </Panel>
);

const VariantsFields = ({ disabled, formValues, subaccountId }) => {
  const CountField = formValues.audience_selection === 'sample_size' ? SampleSizeField : PercentField;
  return (
    <Fragment>
      <Panel sectioned>
        <h6 className={styles.SmallHeader}>Default Template</h6>
        <Grid>
          <Grid.Column>
            <Field
              name='default_template.template_object'
              component={TemplateTypeaheadWrapper}
              label='Select a default template'
              placeholder='Type to search'
              validate={required}
              disabled={disabled}
              subaccountId={subaccountId}
            />
          </Grid.Column>
          <Grid.Column>
            <CountField namespace='default_template' disabled={disabled} />
          </Grid.Column>
        </Grid>
      </Panel>
      <FieldArray
        name='variants'
        component={RenderVariants}
        formValues={formValues}
        disabled={disabled}
        subaccountId={subaccountId}
      />

      {/* This is a temporary hack to make sure at least some of the last typeahead is visible on screen */}
      <div style={{ height: '200px' }} />
    </Fragment>
  );
};

VariantsFields.defaultProps = {
  formValues: {}
};

export default VariantsFields;
