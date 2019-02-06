import React from 'react';
import Actions from '../Actions';
import content from '../../constants/engagementRecencyContent';

const EngagementRecencyActions = ({ cohorts, date }) => {
  let actions = [];

  content.forEach(({ condition, ...rest }) => {
    if (condition(cohorts)) {
      actions.push(rest);
    }
  });

  actions = actions.slice(0, 3);
  return <Actions actions={actions} date={date} empty={cohorts.c_total === null} />;
};

export default EngagementRecencyActions;
