import debugLog from 'src/__testHelpers__/debugLog';

const defaultResponse = {
  data: {
    success: true,
    results: []
  }
};

debugLog('DEBUG MODE ON');

export default (request) => {
  const { method, url } = request;
  const responsePath = `/${url}/${method.toLowerCase()}`.replace('//', '/');
  let storedResponse;

  try {
    storedResponse = require(`src/__integration__/http-responses/${responsePath}`);
  } catch (err) {
    // ignore require errors
    debugLog(`No stored response for ${method} ${url}`);
  }

  if (storedResponse && storedResponse.default) {
    debugLog(`Stored response found for ${method} ${url}`);
    return { data: storedResponse.default(request) };
  } else {
    return defaultResponse;
  }
};
