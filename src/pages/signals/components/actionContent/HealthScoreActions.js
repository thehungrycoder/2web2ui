import React from 'react';
import Actions from '../Actions';
import content from '../../constants/healthScoreContent.js';
import _ from 'lodash';

const HealthScoreActions = ({ date, weights }) => {
  const actions = weights.reduce((acc, { weight, weight_type }) => {
    const parsedWeight = parseFloat(weight);

    if (parsedWeight < 0 && content[weight_type]) {
      acc.push({
        weight: parsedWeight,
        content: _.get(content[weight_type], 'content'),
        link: _.get(content[weight_type], 'link'),
        type: 'bad'
      });
    }

    return acc;
  }, []);

  const sorted = _.orderBy(actions, 'weight', 'asc').slice(0, 2);
  return <Actions actions={sorted} date={date} empty={!actions.length} />;
};

export default HealthScoreActions;
