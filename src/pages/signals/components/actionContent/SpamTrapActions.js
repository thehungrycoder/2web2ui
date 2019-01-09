import React, { Fragment } from 'react';
import Actions from '../Actions';
import content from '../../constants/spamTrapContent';
import _ from 'lodash';

const SpamTrapActions = ({ percent }) => {
  let action;

  content.forEach(({ condition = () => true, ...rest }) => {
    if (condition(percent)) {
      action = rest;
    }
  });

  return <Actions actions={[action]} empty={_.isNil(percent)}/>;
}

export default SpamTrapActions;
