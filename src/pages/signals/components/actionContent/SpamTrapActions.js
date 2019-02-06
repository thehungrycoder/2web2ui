import React from 'react';
import Actions from '../Actions';
import content from '../../constants/spamTrapContent';
import _ from 'lodash';

const SpamTrapActions = ({ date, percent }) => {
  const action = content.filter(({ condition, ...rest }) => condition(percent));
  return <Actions actions={action} date={date} empty={_.isNil(percent)}/>;
};

export default SpamTrapActions;
