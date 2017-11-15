import React, { Component } from 'react';

import { Panel } from '@sparkpost/matchbox';
import { LabelledValue, CopyField } from 'src/components';
import _ from 'lodash';

class MessageDetails extends Component {
  static defaultProps = {
    details: {}
  }

  render() {
    const { details } = this.props;
    const { rcpt_to, subject, friendly_from, ...otherDetails } = details;

    const markup = _.keys(otherDetails).map((key) => <Panel.Section>{key}: {details[key].toString()}</Panel.Section>);

    return (
      <div>
        <Panel>
          <Panel.Section>
            <LabelledValue label='To' value={rcpt_to} />
            <LabelledValue label='From' value={friendly_from} />
            <LabelledValue label='Subject' value={subject} />
          </Panel.Section>
        </Panel>
        <Panel>{ markup }</Panel>
        <Panel sectioned>
          <LabelledValue
            label='Raw Json'
            value={<CopyField value={JSON.stringify(details)}/>} />
        </Panel>
      </div>
    );
  }
}

export default MessageDetails;
