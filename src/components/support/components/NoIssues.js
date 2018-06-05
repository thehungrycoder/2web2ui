import React from 'react';
import { Button } from '@sparkpost/matchbox';
import styles from '../Support.module.scss';

const NoIssues = ({ onCancel }) => (
  <div className={styles.SupportContainer}>
    <h6>Sorry, you are not authorized to submit a support ticket.</h6>
    <Button flat color='orange' onClick={onCancel}>Search support articles</Button>
  </div>
);

export default NoIssues;
