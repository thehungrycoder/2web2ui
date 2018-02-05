const firstError = (resp) => {
  const errs = resp.errors;
  if (errs && Array.isArray(errs) && errs.length) {
    return errs[0];
  }
  return null;
};

const unpackResponse = (rawResponse) => rawResponse.response.data;
const errorDesc = (error) => error.description ? error.description : error.message;

// Convert an API response into a global alert for the showAlert() action creator.
// @param {Object} SparkPost API success or error response
// from sparkpostApiRequest()
export const apiResponseToAlert = (response, message) => {
  const unpacked = unpackResponse(response);
  const err = firstError(unpacked);
  if (err) {
    const details = errorDesc(firstError(unpacked));
    return { type: 'error', message, details };
  }
  return { type: 'success', message };
};
