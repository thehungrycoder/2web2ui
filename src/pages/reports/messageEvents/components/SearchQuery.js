import React, { Fragment } from 'react';
import { Button, Grid } from '@sparkpost/matchbox';
import { AddCircleOutline, RemoveCircleOutline } from '@sparkpost/matchbox-icons';
import styles from './AdvancedFilters.module.scss';
import { Field } from 'redux-form';
import { SelectWrapper, TextFieldWrapper } from '../../../../components/reduxFormWrappers';
import { required } from '../../../../helpers/validation';
import { EVENTS_SEARCH_FILTERS } from '../../../../constants';

const EVENTS_SELECTOR = [{ disabled: true, value: '', label: 'Select a Filter' },
  ... EVENTS_SEARCH_FILTERS,
  { hidden: true, value: '', label: '_______________' }];//This is just so the dropdown stays at the same length. TODO CSS?

//Returns options array only containing those not selected yet and the currently selected option.
const getAvailableOptions = (filters, index) => {
  const used = filters.map((item) => item.key);
  return EVENTS_SELECTOR.filter((searchParameter) => !used.includes(searchParameter.value) || searchParameter.value === filters[index].key);
};


export default ({ input, meta, fields }) => (
  <Fragment>
    <Button color="blue" flat onClick={() => fields.push({})}> Add Filter <AddCircleOutline/></Button>
    {fields.map((member, index) => (
      <Grid key={index}>
        <Grid.Column
          className = {styles.SmallText}
          xs={12}
          md={3}
          lg={3}
        >
          <Field
            name={`${member}.key`}
            component={SelectWrapper}
            options={getAvailableOptions(fields.getAll(), index)}
            validate={required}
          />
        </Grid.Column>
        <Grid.Column
          xs={12}
          md={6}
          lg={6}
        >
          <Field
            name={`${member}.value`}
            type="text"
            component={TextFieldWrapper}
            validate={required}
          />
        </Grid.Column>
        <Grid.Column
          xs={12}
          md={2}
          lg={2}
        >
          <p>
            <Button color="red" flat onClick={() => fields.remove(index)}>Remove <RemoveCircleOutline/></Button>
          </p>
        </Grid.Column>
      </Grid>
    ))}
  </Fragment >
);
