// Google Tag Manager tracking helpers
// Adapted from webui/src/common/services/analytics.js

function setup() {
  if (!window.dataLayer) {
    window.dataLayer = [{
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    }];
  }
}

function pushEvent(evt) {
  window.dataLayer.push(evt);
}

function trackPageview(path, title, username) {
  pushEvent({
    event: 'content-view',
    'content-name': path,
    'content-title': title,
    username
  });
}

function trackEvent(category, action, data) {
  pushEvent({
    event: category,
    'event-action': action,
    'event-data': data || {}
  });
}

function trackFormSuccess(action, data) {
  trackEvent('Completed form', action, data);
}

function setVariable(name, value) {
  pushEvent({ [name]: value });
}

export {
  setup,
  trackPageview,
  trackEvent,
  trackFormSuccess,
  setVariable
};
