import React from 'react';
import { Checkbox, Tooltip } from '@sparkpost/matchbox';
import { Field } from 'redux-form';
import { CheckboxWrapper } from 'src/components/reduxFormWrappers';

import styles from './SearchForm.module.scss';

const EventTypeFilters = ({ eventTypeDocs }) => <Checkbox.Group label='Event Type'>
  <div className={styles.CheckBoxGrid}>
    {eventTypeDocs.map((evtDoc) =>
      <Field
        name={evtDoc.type}
        component={CheckboxWrapper}
        key={evtDoc.type}
        label={<Tooltip dark content={evtDoc.description}>{evtDoc.displayName}</Tooltip>}
        type="checkbox"
      />
    )}
  </div>
</Checkbox.Group>;

export default EventTypeFilters;
