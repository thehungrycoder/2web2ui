import _ from 'lodash';

export default class SparkpostApiError extends Error {
  name = 'SparkpostApiError';

  constructor({ message, fileName, lineNumber, ...rest }) {
    const error = _.get(rest, 'response.data.errors[0]', {});

    super(
      error.description || error.message || message,
      fileName,
      lineNumber
    );

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    Error.captureStackTrace && Error.captureStackTrace(this, SparkpostApiError);

    // Intentionally assigning additional properties
    Object.assign(this, rest);
  }
}
