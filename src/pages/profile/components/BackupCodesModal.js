import React from 'react';
import Modal from 'src/components/modals/Modal';
import { Panel } from '@sparkpost/matchbox';

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
      <Panel title='Generate 2FA Backup Codes' accent actions={[{ content: 'Cancel', onClick: onClose }]}>
        <Panel.Section>back up codes dance woo</Panel.Section>
      </Panel>
    </Modal>
  );
}
