import _ from 'lodash';

// TODO: Return an Error object as if we were to create it with class and extends Error
function SparkpostApiError(error) {
  const apiError = _.get(error, 'response.data.errors[0]', {});

  this.name = 'SparkpostApiError';
  this.message = apiError.description || apiError.message || error.message;
  this.stack = error.stack; // must manually assign prototype value

  // Intentionally assigning additional properties
  Object.assign(this, error);
}

SparkpostApiError.prototype = Object.create(Error.prototype);

export default SparkpostApiError;
