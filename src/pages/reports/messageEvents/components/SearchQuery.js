import React, { Fragment } from 'react';
import { Button, Grid } from '@sparkpost/matchbox';
import { AddCircleOutline, RemoveCircleOutline } from '@sparkpost/matchbox-icons';
import styles from './AdvancedFilters.module.scss';
import { Field } from 'redux-form';
import { getFiltersAsArray } from 'src/helpers/messageEvents';
import { SelectWrapper, TextFieldWrapper } from 'src/components/reduxFormWrappers';
import { required, isValidQuery } from 'src/helpers/validation';
import { EVENTS_SEARCH_FILTERS } from 'src/constants';
import _ from 'lodash';

const EVENTS_SELECTOR = [{ disabled: true, value: '', label: 'Select a Filter' },
  ... getFiltersAsArray(),
  { hidden: true, value: '', label: '_______________' }];//This is just so the dropdown stays at the same length. TODO CSS?

const VALIDATION_TEXT = ['', 'Supports comma-separated values', 'Supports wildcards', 'Supports comma-separated values and wildcards'];

//Returns options array only containing those not selected yet and the currently selected option.
const getAvailableOptions = (filters, index) => {
  const used = filters.map((item) => item.key);
  return EVENTS_SELECTOR.filter((searchParameter) => !used.includes(searchParameter.value) || searchParameter.value === filters[index].key);
};

const getPlaceholderText = _.memoize((key) => {
  if (!key) {
    return 'Select Filter Type';
  }
  const helpText = EVENTS_SEARCH_FILTERS[key].placeholder;
  const index = ((EVENTS_SEARCH_FILTERS[key].comma) ? 1 : 0) + ((EVENTS_SEARCH_FILTERS[key].wildcard) ? 2 : 0);
  const validationText = VALIDATION_TEXT[index];
  return `${helpText} ${validationText}`;
});

export default ({ fields }) => (
  <Fragment>
    <Button color="blue" flat onClick={() => fields.push({})}> Add Filter<AddCircleOutline className = {styles.Icon}/></Button>
    {fields.map((member, index) => (
      <Grid key={index}>
        <Grid.Column
          className = {styles.SmallText}
          xs={12}
          md={12}
          lg={2}
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
          md={12}
          lg={7}
        >
          <Field
            name={`${member}.value`}
            type="text"
            placeholder = {getPlaceholderText(fields.get(index).key)}
            component={TextFieldWrapper}
            validate={isValidQuery}
          />
        </Grid.Column>
        <Grid.Column
          xs={12}
          md={12}
          lg={2}
        >
          <p>
            <Button color="red" flat onClick={() => fields.remove(index)}>Remove<RemoveCircleOutline className = {styles.Icon}/></Button>
          </p>
        </Grid.Column>
      </Grid>
    ))}
  </Fragment >
);
