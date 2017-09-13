import _ from 'lodash';

/*
    Build an event tree based on the docs from /webhooks/documentation. Passed
    to _.once() in the constructor so it only happens once per mount.
    TODO: consider using this in the reducer. This doesn't change from webhook
          to webhook, and if other resources need to use webhooks/documentation
          we can put it on its own key in the state.
  */
export default function(eventGroups) {
  return _.map(eventGroups, ({ display_name, description, events }, key) => ({
    key: key,
    label: display_name,
    description: description,
    events: _.map(events, ({ display_name, description }, eventKey) => ({
      key: eventKey,
      label: display_name,
      description: description
    }))
  }));
}
