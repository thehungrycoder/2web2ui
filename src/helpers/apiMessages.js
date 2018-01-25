const firstError = (resp) => {
  const errs = resp.errors;
  if (errs && Array.isArray(errs) && errs.length) {
    return errs[0];
  }
  return null;
};

// Extract an informative status description from a SparkPost API response.
// May be used with success and failure response objects from sparkpostApiRequest().
// @param {Object} SparkPost API success or error response
export const apiCallMessage = (response) => {
  const respData = response.response.data;
  const first = firstError(respData);
  if (first) {
    return first.description ? first.description : first.message;
  }
  return respData.message;
};
