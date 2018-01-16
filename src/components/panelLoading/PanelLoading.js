import React from 'react';
import styles from './PanelLoading.module.scss';
import { Panel } from '@sparkpost/matchbox';
import { Loading } from 'src/components/loading/Loading';

const PanelLoading = ({ minHeight }) => (
  <Panel className={styles.Loading} style={{ minHeight }}>
    <Loading />
  </Panel>
);

PanelLoading.defaultProps = {
  minHeight: '400px'
};

export default PanelLoading;
