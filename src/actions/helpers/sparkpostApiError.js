import _ from 'lodash';

export class SparkpostApiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SparkpostApiError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SparkpostApiError);
    }

    const description = _.get(message, 'response.data.errors[0].description');

    if (description) {
      this.message = description;
    }
  }
}
