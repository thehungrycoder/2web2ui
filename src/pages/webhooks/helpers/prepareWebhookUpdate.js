import _ from 'lodash';
import resolveAuthUpdates from './resolveAuthUpdates';

export default function(values, allEvents) {
  const { name, target, active } = values;
  const update = {
    ...resolveAuthUpdates(values),
    name,
    target,
    active
  };

  const checkedEvents = _.concat(
    values.message_event,
    values.track_event,
    values.gen_event,
    values.unsubscribe_event,
    values.relay_event
  );

  // "All" selected, or all boxes clicked
  if (values.eventsRadio === 'all' || checkedEvents.length === allEvents.length) {
    update.events = allEvents;
  } else {
    update.events = _.filter(checkedEvents, (event) => (event)); // remove for truthy
  }

  return update;
}
