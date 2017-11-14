/* eslint-disable */
import React from 'react';
import { Panel } from '@sparkpost/matchbox';
import _ from 'lodash';

const MessageDetails = ({ details = {} }) => {
  console.log(details);
  const { rcpt_to, subject, friendly_from, ...otherDetails } = details;

  const markup = _.keys(otherDetails).map((key) => {
    return <Panel.Section>{key}: {details[key].toString()}</Panel.Section>
  });

  console.log(markup)
  return (
    <div>
      <Panel>
        <Panel.Section>To: {rcpt_to}</Panel.Section>
        <Panel.Section>From: {friendly_from}</Panel.Section>
        <Panel.Section>Subject: {subject}</Panel.Section>
      </Panel>
      <Panel>
        { markup }
      </Panel>
    </div>
)};

export default MessageDetails;
