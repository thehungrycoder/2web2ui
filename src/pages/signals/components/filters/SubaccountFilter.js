import React from 'react';
import { Popover, Button } from '@sparkpost/matchbox';
import { ArrowDropDown } from '@sparkpost/matchbox-icons';
import styles from './SubaccountFilter.module.scss';

const Trigger = ({ label }) => (
  <Button fullWidth>{label} <ArrowDropDown /></Button>
);

const SubaccountFilter = () => (
  <div className={styles.SubaccountFilter}>
    <Popover
      sectioned
      left
      style={{ width: '250px' }}
      trigger={<Trigger label='Master & All Subaccounts' />} >
    </Popover>
  </div>
);

export default SubaccountFilter;
