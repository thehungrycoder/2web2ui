import _ from 'lodash';
import resolveAuthUpdates from './resolveAuthUpdates';

export default function(values, webhook, allEvents) {
  const update = { ...resolveAuthUpdates(values, webhook) };

  if (values.name !== webhook.name) {
    update.name = values.name;
  }

  if (values.target !== webhook.target) {
    update.target = values.target;
  }

  const checkedEvents = _.concat(values.message_event, values.track_event, values.gen_event, values.unsubscribe_event, values.relay_event);

  // "All" selected, or all boxes clicked
  if (values.eventsRadio === 'all' || checkedEvents.length === allEvents.length) {
    if (webhook.events.length !== allEvents.length) {
      update.events = allEvents;
    }
  } else {
    if (!_.isEqual(webhook.events, checkedEvents)) {
      update.events = _.filter(checkedEvents, (event) => (event)); // remove for truthy
    }
  }
}
