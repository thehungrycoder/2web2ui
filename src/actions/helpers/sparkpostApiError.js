import _ from 'lodash';

// Unable to extend Error class due to Babel 6 constraints
class SparkpostApiError {
  constructor(error) {
    const apiError = _.get(error, 'response.data.errors[0]') || _.get(error, 'response.data.errors', {}); // errors can be array or object
    const message = apiError.description || apiError.message || error.message;

    this.name = 'SparkpostApiError';
    this.message = message;
    this.stack = (new Error(message)).stack; // must manually assign prototype value

    // Intentionally assigning additional properties
    Object.assign(this, error);
  }
}

SparkpostApiError.prototype = Object.create(Error.prototype);
SparkpostApiError.prototype.constructor = SparkpostApiError;

export default SparkpostApiError;
