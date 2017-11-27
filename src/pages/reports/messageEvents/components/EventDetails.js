import React, { Component } from 'react';

import { Panel, Tooltip } from '@sparkpost/matchbox';
import { LabelledValue, CopyField } from 'src/components';

import _ from 'lodash';

class EventDetails extends Component {
  static defaultProps = {
    details: {}
  }

  renderRow = ({ value, label, key }) => {
    // Renders value in a read only textfield
    if (typeof value === 'object') {
      return (
        <LabelledValue key={key} label={label}>
          <CopyField hideCopy value={JSON.stringify(value)} />
        </LabelledValue>
      );
    }

    return <LabelledValue key={key} label={label} value={value} />;
  }

  // Renders key-value rows
  renderDetails = (detailsToRender) => {
    const { documentation } = this.props;

    return _.keys(detailsToRender).map((key) => {

      // Gets tooltip content from documentation store
      const tooltipContent = _.get(documentation, [detailsToRender.type, key]);

      const row = {
        key,
        label: tooltipContent ? <Tooltip dark content={tooltipContent}>{key}</Tooltip> : key,
        value: detailsToRender[key]
      };

      return this.renderRow(row);
    });
  }

  render() {
    // Remove formattedDate as its only used for the history table
    const detailsToRender = _.omit(this.props.details, 'formattedDate');

    return (
      <Panel title='Event Details'>
        <Panel.Section>
          { this.renderDetails(detailsToRender) }
        </Panel.Section>
        <Panel.Section>
          <LabelledValue label='Raw Json'>
            <CopyField value={JSON.stringify(detailsToRender)}/>
          </LabelledValue>
        </Panel.Section>
      </Panel>
    );
  }
}

export default EventDetails;
