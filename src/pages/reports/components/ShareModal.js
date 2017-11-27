import React from 'react';
import { Panel, Button, WindowEvent } from '@sparkpost/matchbox';
import { Modal, CopyField } from 'src/components';

const ShareModal = ({ open, link, handleToggle }) => (
  <Modal open={open}>
    { open && <WindowEvent event='keydown' handler={handleToggle} />}
    <Panel title='Share this report'>
      <Panel.Section>
        <CopyField value={link} />
        <Button primary onClick={handleToggle}>Done</Button>
      </Panel.Section>
    </Panel>
  </Modal>
);

export default ShareModal;
