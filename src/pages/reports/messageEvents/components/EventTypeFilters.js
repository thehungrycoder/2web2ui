import React from 'react';
import { Checkbox, Tooltip } from '@sparkpost/matchbox';
import { Field } from 'redux-form';
import { CheckboxWrapper } from '../../../../components';

import styles from './AdvancedFilters.module.scss';

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
