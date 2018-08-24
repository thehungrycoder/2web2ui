import React from 'react';
import { Checkbox } from '@sparkpost/matchbox';
import styles from './AdvancedFilters.module.scss';
import { snakeToFriendly } from 'src/helpers/string';

const EventTypeFilters = ({ eventTypes, checkedTypes, onChange }) => <Checkbox.Group label='Event Type'>
  {eventTypes.map((evtType) => <div className={styles.CheckWrapper} key={evtType}>
    <Checkbox
      id={evtType}
      onChange={() => onChange(evtType)}
      label={snakeToFriendly(evtType)}
      checked={checkedTypes[evtType] || false}
    />
  </div>
  )}
</Checkbox.Group>;

export default EventTypeFilters;
