import React from 'react';
import { Tag } from '@sparkpost/matchbox';
import { Link } from 'react-router-dom';

const statusTagColors = {
  suspended: 'yellow',
  terminated: 'red'
};

/*
 Subaccounts getRowData passed to TableCollection in ListPage.
*/
const getRowData = ({ status, id, name }) => [
  <Link to={`/account/subaccounts/${id}`}>{name}</Link>,
  <p>{id}</p>,
  <Tag color={statusTagColors[status]}>{status}</Tag>
];

export default getRowData;
