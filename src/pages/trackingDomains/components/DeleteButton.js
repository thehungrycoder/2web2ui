import React from 'react';
import { Button } from '@sparkpost/matchbox';

export default function({ status, onClick }) {
  if (status === 'pending' || status === 'blocked') {
    return null;
  }
  return <Button destructive size='small' onClick={onClick}>Delete</Button>;
}
