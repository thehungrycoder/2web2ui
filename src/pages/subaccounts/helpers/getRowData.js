import React from 'react';
import styles from './rowData.module.scss';
import { Link } from 'react-router-dom';

const STATUS_CLASSES = {
  active: styles.StatusActive,
  suspended: styles.StatusSuspended,
  terminated: styles.StatusTerminated
};


/*
 Subaccounts getRowData passed to TableCollection in ListPage.
*/
const getRowData = ({ status, id, name, compliance }) => [
  <Link to={`/account/subaccounts/${id}`}>{name}</Link>,
  <p>{id}</p>,
  <p className={STATUS_CLASSES[status]}>{status}</p>
];

export default getRowData;
