import React from 'react';
import { differenceInHours } from 'date-fns';
import TimeAgo from 'react-timeago';

const DisplayDate = ({ timestamp, formattedDate }) => {
  if (differenceInHours(Date.now(), timestamp) > 23) {
    return formattedDate;
  }
  return <TimeAgo date={timestamp} />;
};

export default DisplayDate;
