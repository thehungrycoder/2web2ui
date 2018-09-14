import React from 'react';
import ConfirmationModal from './ConfirmationModal';

export default function DeleteModal({ onDelete, deleting, ...props }) {
  return (
    <ConfirmationModal
      confirming={deleting}
      confirmVerb='Delete'
      onConfirm={onDelete}
      {...props}
    />
  );
}
