/* eslint-disable */
import React, { Component } from 'react';
import copy from 'copy-to-clipboard';

import { Panel, TextField, Icon, Button } from '@sparkpost/matchbox';
import DetailSection from './DetailSection';
import _ from 'lodash';

import styles from './MessageDetails.module.scss';

class MessageDetails extends Component {
  static defaultProps = {
    details: {}
  }

  handleFieldFocus = (e) => {
    e.target.select();
  }

  handleCopy = () => {
    copy(JSON.stringify(this.props.details))
  }

  render() {
    const { details } = this.props;
    const { rcpt_to, subject, friendly_from, ...otherDetails } = details;

    const markup = _.keys(otherDetails).map((key) => {
      return <Panel.Section>{key}: {details[key].toString()}</Panel.Section>
    });

    const copyButton = <Button onClick={() => this.handleCopy()}><Icon name='Copy'/></Button>;

    const jsonField = <TextField
      readOnly
      connectRight={copyButton}
      value={JSON.stringify(details)}
      onFocus={this.handleFieldFocus} />

    return (
      <div>
        <Panel>
          <Panel.Section>
            <DetailSection label='To' content={rcpt_to} />
            <DetailSection label='From' content={friendly_from} />
            <DetailSection label='Subject' content={subject} />
          </Panel.Section>
        </Panel>
        {/* <Panel>{ markup }</Panel> */}
        <Panel sectioned>
          <DetailSection
            label='Raw JSON'
            content={jsonField} />
        </Panel>
      </div>
    );
  }
}

export default MessageDetails;
