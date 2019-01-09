import React from 'react';
import Actions from '../Actions';
import content from '../../constants/healthScoreContent.js';
import _ from 'lodash';

const HealthScoreActions = ({ weights }) => {
  const actions = weights.reduce((acc, { weight, weight_type }) => {
    const parsedWeight = parseFloat(weight);

    if (parsedWeight < 0) {
      acc.push({
        weight: parsedWeight,
        content: content[weight_type],
        type: 'bad'
      });
    }

    return acc;
  }, []);

  const sorted = _.orderBy(actions, 'weight', 'asc').slice(0, 2);
  return <Actions actions={sorted} empty={!actions.length}/>;
};

export default HealthScoreActions;
