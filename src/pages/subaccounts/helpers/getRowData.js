import React from 'react';
import { snakeToFriendly } from 'src/helpers/string';
import { Tag } from '@sparkpost/matchbox';
import { Link } from 'react-router-dom';

const statusTagColors = {
  active: null,
  suspended: 'yellow',
  terminated: 'red'
};

/*
 Subaccounts getRowData passed to TableCollection in ListPage.
*/
const getRowData = ({ status, id, name }) => [
  <Link to={`/account/subaccounts/${id}`}>{name}</Link>,
  <p>{id}</p>,
  <Tag color={statusTagColors[status]}>{snakeToFriendly(status)}</Tag>
];

export default getRowData;
