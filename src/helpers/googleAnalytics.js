import config from 'src/config';
const { gaTag } = config;

function addEvent(event_category, event_action, data) {
  window.gtag('config', gaTag, {
    event_category,
    event_action,
    data
  });
}

export {
  addEvent
};
