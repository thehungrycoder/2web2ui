import React, { Component } from 'react';
import { Modal, Panel, Button, Checkbox, Tooltip } from '@sparkpost/matchbox';
import { list } from 'src/config/metrics';
import _ from 'lodash';
import styles from './MetricsModal.module.scss';

const METRICS_LIST = _.sortBy(list, ['label']);
const MAX_METRICS = 5;

class MetricsModal extends Component {
  componentWillMount() {
    this.syncPropsToState(this.props);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    this.syncPropsToState(nextProps);
  }

  syncPropsToState = ({ selectedMetrics }) => {
    METRICS_LIST.map(({ key }) => {
      const isActive = _.some(selectedMetrics, { key });
      this.setState({ [key]: isActive });
    });
  }

  handleCheckbox = (key) => {
    this.setState({ [key]: !this.state[key] });
  }

  handleApply = () => {
    this.props.onSubmit(this.getSelectedMetrics());
  }

  handleKeyDown = (e) => {
    const { open, onCancel } = this.props;

    if (!open) {
      return;
    }

    if (e.key === 'Enter') {
      this.handleApply();
    }

    if (e.key === 'Escape') {
      onCancel();
    }
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
    const { open, onCancel } = this.props;
    return (
      <Modal open={open}>
        <Panel>
          <Panel.Section>
            <h5>Select up to 5 metrics</h5>
            <div>{ this.renderMetrics() }</div>
          </Panel.Section>
          <Panel.Section>
            <Button onClick={this.handleApply} primary className={styles.Apply}>Apply Metrics</Button>
            <Button onClick={onCancel} className={styles.Cancel}>Cancel</Button>
          </Panel.Section>
        </Panel>
      </Modal>
    );
  }
}

export default MetricsModal;
