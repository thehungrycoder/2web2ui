import React, { Component } from 'react';
import { Modal, Panel, Button, Checkbox, Tooltip } from '@sparkpost/matchbox';
import { list } from 'config/metrics';
import _ from 'lodash';
import styles from './MetricsModal.module.scss';

const METRICS_LIST = _.sortBy(list, ['label']);
const MAX_METRICS = 5;

class MetricsModal extends Component {
  componentWillMount() {
    this.syncPropsToState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.syncPropsToState(nextProps);
  }

  syncPropsToState = ({ selectedMetrics }) => {
    METRICS_LIST.map((metric) => {
      const isActive = _.findIndex(selectedMetrics, (key) => key === metric.key) > -1;
      this.setState({ [metric.key]: isActive });
    });
  }

  handleCheckbox = (key) => {
    this.setState({ [key]: !this.state[key] });
  }

  handleApply = () => {
    this.props.handleApply(this.getSelectedMetrics());
  }

  getSelectedMetrics = () => _.keys(this.state).filter((key) => !!this.state[key])

  renderMetrics() {
    const selectedCount = this.getSelectedMetrics().length;
    return METRICS_LIST.map((metric) => {
      if (metric.inSummary) {
        const checked = this.state[metric.key];
        return (
          <div className={styles.Metric} key={metric.key}>
            <Tooltip content={metric.description}>
              <Checkbox
                id={metric.key}
                disabled={selectedCount >= MAX_METRICS && !checked}
                onChange={() => this.handleCheckbox(metric.key)}
                checked={checked}
                label={metric.label} />
            </Tooltip>
          </div>
        );
      }
    });
  }

  render() {
    const { open, handleToggle } = this.props;
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
