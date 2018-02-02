import React from 'react';
import styles from './Note.module.scss';

export default function Note({ children }) {
  return <div className={styles.Note}>{children}</div>;
}
