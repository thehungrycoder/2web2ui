const defaultResponse = {
  data: {
    success: true,
    results: []
  }
};

export default (request) => {
  const { method, url } = request;
  const directory = url.toLowerCase().replace(/\//g, '_');
  let storedResponse;

  try {
    storedResponse = require(`src/__integration__/http-responses/${directory}/${method}`);
  } catch (err) {
    // ignore require errors
    // eslint-disable-next-line no-console
    process.env.DEBUG === true && console.log(`No stored response for ${method} ${url}`);
  }

  if (storedResponse && storedResponse.default) {
    return { data: storedResponse.default(request) };
  } else {
    return defaultResponse;
  }
};
