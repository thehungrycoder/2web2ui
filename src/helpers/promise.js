function wait(options) {
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
function resolveOnCondition(condition, options = {}) {
  return new Promise((resolve, reject) => {
    if (typeof condition !== 'function') {
      return reject(new Error('condition function not provided to resolveOnCondition helper'));
    }
    wait({ resolve, reject, condition, ...options });
  });
}

const captureSuccess = (result) => ({ state: 'fulfilled', result });
const captureFail = (error) => ({ state: 'rejected', error });

const allSettled = (promises, { onlyFulfilled = false, onlyRejected = false }) => {
  const settled = Promise.all(promises.map((p) => p.then(captureSuccess).catch(captureFail)));

  if (onlyFulfilled) {
    return settled.then((results) => results.filter((r) => r.state === 'fulfilled').map((r) => r.result));
  }

  if (onlyRejected) {
    return settled.then((results) => results.filter((r) => r.state === 'rejected').map((r) => r.error));
  }

  return settled;
};

export {
  resolveOnCondition,
  allSettled
};
