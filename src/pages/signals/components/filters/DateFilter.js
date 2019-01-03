import React from 'react';
import { Select } from '@sparkpost/matchbox';
import withSignalOptions from '../withSignalOptions';
import styles from './DateFilter.module.scss';

const OPTIONS = [
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 14 Days', value: '14days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Last 90 Days', value: '90days' }
];

export class DateFilter extends React.Component {
  handleChange = (event) => {
    const { changeSignalOptions } = this.props;
    changeSignalOptions({ relativeRange: event.currentTarget.value });
  }

  render() {
    const { relativeRange } = this.props;

    return (
      <div className={styles.DateFilter}>
        <Select
          onChange={this.handleChange}
          options={OPTIONS}
          value={relativeRange}
        />
      </div>
    );
  }
}

export default withSignalOptions(DateFilter);
