// Google Tag Manager tracking helpers
// Adapted from webui/src/common/services/analytics.js

// Call once at app load time to initialise the GTM dataLayer variable
// and trigger the GA 'Page View' event.
export function setup() {
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

// Call on route change.
// Used in Marketing GTM account.
export function trackPageview({ path, title }) {
  pushEvent({
    event: 'content-view',
    'content-name': path,
    'content-title': title
  });
}

// Call to push a generic event to GTM.
export function trackEvent({ category, action, data }) {
  pushEvent({
    event: category,
    'event-action': action,
    'event-data': data || {}
  });
}

// Call to track specific form completion.
// Used in the Marketing GTM account to track conversions.
export function trackFormSuccess(action, data) {
  trackEvent({ category: 'Completed form', action, data });
}

// Call to send a variable to GTM.
export function setVariable(name, value) {
  pushEvent({ [name]: value });
}
