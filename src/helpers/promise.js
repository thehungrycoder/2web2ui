function wait (options) {
  const {
    condition,
    resolve,
    reject = resolve,
    ms = 500,
    retry = 0,
    maxRetries = 100
  } = options;

  if (retry >= maxRetries) {
    return reject(new Error('Max retries reached'));
  }

  setTimeout(() => {
    if (condition()) {
      return resolve();
    }
    wait({ ...options, retry: retry + 1 });
  }, ms);
}

/**
 *
 * @param {function} condition - should return truthy to resolve, falsey to continue waiting
 * @param {object} options - optional hash of retry options
 * @param {int}    options.ms - number of ms to wait between condition checks (default: 500)
 * @param {int}    options.maxRetries - number of retries it should attempt before rejecting (default: 100)
 *
 * @return {Promise} - promise that will resolve when condition is met
 */
function resolveOnCondition (condition, options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof condition !== 'function') {
      return reject(new Error('condition function not provided to resolveOnCondition helper'));
    }
    wait({ resolve, reject, condition, ...options });
  });
}

export { resolveOnCondition };
