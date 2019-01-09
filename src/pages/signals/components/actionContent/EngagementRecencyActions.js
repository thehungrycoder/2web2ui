import React from 'react';
import Actions from '../Actions';
import content from '../../constants/engagementRecencyContent';

const EngagementRecencyActions = ({ cohorts }) => {
  let actions = [];

  content.forEach(({ condition = () => true, ...rest }) => {
    if (condition(cohorts)) {
      actions.push(rest);
    }
  });

  actions = actions.slice(0, 3);
  return <Actions actions={actions} />; // todo empty={cohorts.every(key)}
};

export default EngagementRecencyActions;
