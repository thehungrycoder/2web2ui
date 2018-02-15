import React from 'react';
import styles from './BackupCodesList.module.scss';

const BackupCodesList = ({ codes }) => (
  <ul className={styles.List}>
    {codes.map((code) => <li key={code}>{code}</li>)}
  </ul>
);

export default BackupCodesList;
