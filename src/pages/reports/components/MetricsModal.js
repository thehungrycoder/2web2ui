import React from 'react';
import { Modal, Panel, Button } from '@sparkpost/matchbox';

import styles from './MetricsModal.module.scss';

const MetricsModal = (props) => {
  const { open, text, handleToggle, handleApply } = props;
  return (
    <Modal open={open}>
      <Panel title='Select Metrics' sectioned>
        <Button onClick={handleApply} primary className={styles.Apply}>Apply Metrics</Button>
        <Button onClick={handleToggle} className={styles.Cancel}>Cancel</Button>
      </Panel>
    </Modal>
  );
};

export default MetricsModal;
