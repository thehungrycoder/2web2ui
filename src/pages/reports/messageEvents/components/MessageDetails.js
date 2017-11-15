import React, { Component } from 'react';

import { Panel } from '@sparkpost/matchbox';
import { LabelledValue, CopyField } from 'src/components';

import _ from 'lodash';

class MessageDetails extends Component {
  static defaultProps = {
    details: {}
  }

  renderDetails = (details) => _.keys(details).map((key, i) => {
    let value = details[key];

    if (typeof value === 'object') {
      value = <CopyField hideCopy value={JSON.stringify(value)} />;
    }

    return <LabelledValue key={i} label={key} value={value} />;
  })

  render() {
    const { details } = this.props;

    return (
      <Panel>
        <Panel.Section>
          { this.renderDetails(details) }
        </Panel.Section>
        <Panel.Section>
          <LabelledValue
            label='Raw Json'
            value={<CopyField value={JSON.stringify(details)}/>} />
        </Panel.Section>
      </Panel>
    );
  }
}

export default MessageDetails;
