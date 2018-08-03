import React, { Fragment } from 'react';
import { Field, FieldArray } from 'redux-form';
import { Panel, Grid, Button } from '@sparkpost/matchbox';
import { Add } from '@sparkpost/matchbox-icons';
import { TextFieldWrapper } from 'src/components/reduxFormWrappers';
import { TemplateTypeaheadWrapper } from 'src/components/reduxFormWrappers';

import styles from './VariantsFields.module.scss';

export const PercentField = ({ namespace, ...props }) => (
  <Field
    name={`${namespace}.percent`}
    label='Percent of total'
    suffix='%'
    component={TextFieldWrapper} {...props} />
);

export const SampleSizeField = ({ namespace, ...props }) => (
  <Field
    name={`${namespace}.sample_size`}
    label='Number of messages'
    component={TextFieldWrapper} {...props} />
);

/*
  If you're looking at this, refer to https://redux-form.com/7.4.2/examples/fieldarrays/
 */
export const RenderVariants = ({ fields, formValues, disabled }) => (
  <Panel>
    {fields.map((variant, i) => (
      <Panel.Section key={i}>
        <div className={styles.RemoveWrapper}>
          <Button flat color='orange' size='small' onClick={() => fields.remove(i)}>
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
              disabled={disabled}
            />
          </Grid.Column>
          <Grid.Column>
            {
              formValues.audience_selection === 'sample_size'
                ? <SampleSizeField namespace={variant} disabled={disabled} />
                : <PercentField namespace={variant} disabled={disabled} />
            }
          </Grid.Column>
        </Grid>
      </Panel.Section>
    ))}
    <Panel.Section>
      <Button flat color='orange' onClick={() => fields.push()}>
        <Add /> Add Another Variant
      </Button>
    </Panel.Section>
  </Panel>
);

const VariantsFields = ({ disabled, formValues }) => (
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
            disabled={disabled}
          />
        </Grid.Column>
        <Grid.Column>
          {
            formValues.audience_selection === 'sample_size'
              ? <SampleSizeField namespace='default_template' disabled={disabled} />
              : <PercentField namespace='default_template' disabled={disabled} />
          }
        </Grid.Column>
      </Grid>
    </Panel>
    <FieldArray name='variants' component={RenderVariants} formValues={formValues} disabled={disabled} />

    {/* This is a temporary hack to make sure at least some of the last typeahead is visible on screen */}
    <div style={{ height: '200px' }} />
  </Fragment>
);

VariantsFields.defaultProps = {
  formValues: {}
};

export default VariantsFields;
