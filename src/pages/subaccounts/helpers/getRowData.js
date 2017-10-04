import React from 'react';
import styles from './rowData.module.scss';

import { Link } from 'react-router-dom';

/*
 Subaccounts getRowData passed to TableCollection in ListPage.
*/
const getRowData = ({ status, id, name }) => {
  let className;
  switch (status) {
    case 'active':
      className = styles.StatusActive;
      break;
    case 'terminated':
      className = styles.StatusTerminated;
      break;
    case 'suspended':
      className = styles.StatusSuspended;
      break;
  }
  return [
    <Link to={`/account/subaccounts/${id}`}>{name}</Link>,
    <p>{id}</p>,
    <p className={className}>{status}</p>
  ];
};

export default getRowData;
