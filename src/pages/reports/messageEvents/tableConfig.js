/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from '@sparkpost/matchbox';

const listColumns = ['Timestamp', 'Event', 'Recipient', 'Friendly From', null];

const getListRowData = ({ formattedDate, type, friendly_from, rcpt_to, message_id, event_id }) => ([
  formattedDate,
  type,
  rcpt_to,
  friendly_from,
  <Button Component={Link} to={`/reports/message-events/${message_id}/${event_id}`} size='small'>View Details</Button>
]);

const getMessageRowData = ({ formattedDate, type, message_id, event_id, selected }) => {
  console.log(selected);
  return [
    formattedDate,
    type,
    selected ? <Icon name='ChevronRight'/> : null
  ];
}

export {
  listColumns,
  getListRowData,
  getMessageRowData
};
