import _ from 'lodash';

/**
 * Reshapes message event documentation for tooltips
 */
function formatDocumentation(data) {
  const events = {};

  _.each(data, (event) => {
    const { type, ...rest } = event;
    events[event.type.sampleValue] = _.mapValues(rest, ({ description }) => description);
  });

  return events;
}

export {
  formatDocumentation
};
