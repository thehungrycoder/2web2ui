import React, { Component } from 'react';

import { Panel, Tooltip } from '@sparkpost/matchbox';
import { LabelledValue, CopyField } from 'src/components';

import _ from 'lodash';

class MessageDetails extends Component {
  static defaultProps = {
    details: {}
  }

  renderDetails = () => {
    const { details, documentation } = this.props;
    const type = details.type;

    return _.keys(_.omit(details, 'formattedDate')).map((key, i) => {
      const value = details[key];
      const helpText = _.get(documentation, [type, key]);
      const label = helpText ? <Tooltip dark content={helpText}>{key}</Tooltip> : key;

      if (typeof value === 'object') {
        return (
          <LabelledValue key={i} label={label}>
            <CopyField hideCopy value={JSON.stringify(value)} />
          </LabelledValue>
        );
      }

      return <LabelledValue key={i} label={label} value={value} />;
    });
  }

  render() {
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

export default MessageDetails;
