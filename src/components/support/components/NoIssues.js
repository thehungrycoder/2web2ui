import React from 'react';
import { Button } from '@sparkpost/matchbox';
import styles from './NoIssues.module.scss';

const NoIssues = ({ onCancel }) => (
  <div className={styles.NoIssues}>
    <div className={styles.Message}>
      <h6>Sorry, you are not authorized to submit a support ticket.</h6>
      <Button flat color='orange' onClick={onCancel}>Search support articles</Button>
    </div>
  </div>
);

export default NoIssues;
