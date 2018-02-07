import React from 'react';
import Modal from 'src/components/modals/Modal';
import { Panel, Button } from '@sparkpost/matchbox';

export default function BackupCodesModal({
  open,
  onClose,
  generate,
  codes,
  pending,
  error
}) {
  return (
    <Modal open={open}>
      <Panel title='Generate 2FA Backup Codes' accent sectioned>
        back up codes dance woo
        <Button onClick={onClose}>Cancel</Button>
      </Panel>
    </Modal>
  );
}
