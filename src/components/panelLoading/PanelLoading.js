import React from 'react';
import styles from './PanelLoading.module.scss';
import { Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components/loading/Loading';

const PanelLoading = () => (
  <Panel className={styles.Loading}>
    <Loading />
  </Panel>
);

export default PanelLoading;
