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

    return _.keys(details).map((key, i) => {
      const value = details[key];
      const helpText = documentation[type][key];
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
    const { details } = this.props;

    return (
      <Panel>
        <Panel.Section>
          { this.renderDetails(details) }
        </Panel.Section>
        <Panel.Section>
          <LabelledValue label='Raw Json'>
            <CopyField value={JSON.stringify(details)}/>
          </LabelledValue>
        </Panel.Section>
      </Panel>
    );
  }
}

export default MessageDetails;
