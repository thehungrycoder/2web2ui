import _ from 'lodash';
import Raven from 'raven-js';
import createRavenMiddleware from 'raven-for-redux';

/**
 * List of breadcrumbs to ignore to reduce noise
 * @note Sentry has a 100 breadcrumb per event/error maximum
 */
const BLACKLIST = new Set([
  '@@redux/INIT',
  '@@redux-form/BLUR',
  '@@redux-form/CHANGE',
  '@@redux-form/DESTROY',
  '@@redux-form/FOCUS',
  '@@redux-form/REGISTER_FIELD',
  '@@redux-form/TOUCH',
  '@@redux-form/UNREGISTER_FIELD',
  '@@redux-form/UPDATE_SYNC_ERRORS',
  '@@redux-form/INITIALIZE',
  '@@redux-form/STOP_SUBMIT',
  '@@redux-form/SET_SUBMIT_FAILED'
]);

// Chrome and Firefox extensions
export const BROWSER_EXTENSION_REGEX = new RegExp('^(chrome|chrome-extension|resource)://', 'i');

/**
 * Filter out blacklisted breadcrumbs
 *
 * @param {object} crumb
 * @param {string} crumb.category - console, http, redux-action, xhr, etc.
 * @param {string} crumb.message - error message, redux action type, etc.
 * @param {number} crumb.timestamp - created at
 * @see https://docs.sentry.io/clients/javascript/config
 */
export function breadcrumbCallback(crumb) {
  if (BLACKLIST.has(crumb.message)) {
    return false;
  }

  return crumb;
}

// Closure to safely enrich events with data from Redux store
export function getEnricherOrDieTryin(store, window) {
  return function enrich(data) {
    const { currentUser } = store.getState();
    const user = _.pick(currentUser, ['access_level', 'customer', 'username']);

    return {
      ...data,
      tags: { // all tags can be easily searched and sent in Slack notifications
        ...data.tags,
        customer: _.get(user, 'customer'),
        language: _.get(window, 'navigator.language')
      },
      user
    };
  };
}

// The purpose of this helper is to provide a common interface for reporting errors
// with the expectation that the current service will change in the future.
class ErrorTracker {

  /**
   * The service must be configured before it can be used
   * @param {object} store - the Redux store for additional context
   * @param {object}
   */
  install(config, store) {
    const { release, sentry, tenant } = config;

    // Silently ignore installation if Sentry configuration is not provided
    if (!sentry) { return; }

    const dsn = `https://${sentry.publicKey}@sentry.io/${sentry.projectId}`;
    const options = {
      breadcrumbCallback,
      dataCallback: getEnricherOrDieTryin(store, window),
      ignoreUrls: [
        BROWSER_EXTENSION_REGEX
      ],
      release,
      tags: { tenant }
    };

    Raven.config(dsn, options).install();
  }

  // Record redux actions as breadcrumbs
  get middleware() {
    return createRavenMiddleware(Raven);
  }

  /**
   * Report an error
   *
   * @param {string} logger - simple description of where the error was caught
   * @param {Error} error
   * @example
   *   try {
   *     throw new Error('Oh no, save me!');
   *   } catch(error) {
   *     ErrorTracker.report('where-am-i', error);
   *   }
   */
  report(logger, error, extra = {}) {
    // Silently ignore if Sentry is not setup
    if (!Raven.isSetup()) { return; }
    Raven.captureException(error, { logger, extra });
  }
}

// Export a constructed instance to avoid the need to call `new` everywhere
export default new ErrorTracker();
