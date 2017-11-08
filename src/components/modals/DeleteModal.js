import React from 'react';
import ConfirmationModal from './ConfirmationModal';

export default function DeleteModal({ onDelete, ...props }) {
  return (
    <ConfirmationModal
      confirmVerb='Delete'
      onConfirm={onDelete}
      {...props}
    />
  );
}
