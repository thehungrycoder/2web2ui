/* eslint-disable */
import React, { Component } from 'react';
import { Modal, Panel, Button, Checkbox, Tooltip } from '@sparkpost/matchbox';
import { list as METRICS_LIST } from 'config/metrics';
import _ from 'lodash';
import styles from './MetricsModal.module.scss';

class MetricsModal extends Component {
  componentWillMount() {
    this.syncStateWithProps(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.syncStateWithProps(nextProps);
  }

  syncStateWithProps = (props) => {
    METRICS_LIST.map((metric) => {
      const isActive = _.findIndex(props.selectedMetrics, (key) => key === metric.key) > -1;
      this.setState({ [metric.key]: isActive });
    });
  }

  handleCheckbox = (key) => {
    this.setState({ [key]: !this.state[key] });
  }

  handleApply = () => {
    this.props.handleApply(this.getSelectedMetrics());
  }

  getSelectedMetrics = () => {
    return _.keys(this.state).filter((key) => !!this.state[key]);
  }

  renderMetrics() {
    const selectedCount = this.getSelectedMetrics().length;
    return METRICS_LIST.map((metric) => {
      if (metric.label) {
        const selected = this.state[metric.key];
        return (
          <div className={styles.Metric} key={metric.key}>
            <Tooltip content={metric.description}>
              <Checkbox
                id={metric.key}
                disabled={selectedCount > 4 && !selected}
                onChange={() => this.handleCheckbox(metric.key)}
                checked={selected}
                label={metric.label} />
            </Tooltip>
          </div>
        );
      }
    });
  }

  render() {
    const { open, handleToggle, handleApply } = this.props;
    return (
      <Modal open={open}>
        <Panel title='Select Metrics' sectioned>
          <p>Select up to 5 metrics:</p>
          <div>{ this.renderMetrics() }</div>
          <Button onClick={this.handleApply} primary className={styles.Apply}>Apply Metrics</Button>
          <Button onClick={handleToggle} className={styles.Cancel}>Cancel</Button>
        </Panel>
      </Modal>
    );
  }
}

export default MetricsModal;
