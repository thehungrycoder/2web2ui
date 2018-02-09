import _ from 'lodash';
import Papa from 'papaparse';

export const hasData = ({ data }) => {
  if (data.length === 0) {
    return 'No data was found.';
  }
};

export const hasField = (...expectedFields) => ({ meta: { fields }}) => {
  if (!expectedFields.some((field) => fields.includes(field))) {
    return `Missing required field, ${expectedFields[0]}.`;
  }
};

export default ({ meta: { file, validate }, type, parser = Papa }) => async(dispatch) => {
  const types = {
    PENDING: `${type}_PENDING`,
    SUCCESS: `${type}_SUCCESS`,
    FAIL: `${type}_FAIL`
  };

  dispatch({ type: types.PENDING });

  return await new Promise((resolve, reject) => parser.parse(file, {
    complete: ({ data, errors, meta }) => {
      let error;

      if (errors.length > 0) {
        error = new Error('An error occurred while parsing your file.');

        dispatch({
          type: types.FAIL,
          payload: {
            message: error.message,
            details: errors
          }
        });

        reject(error);
        return;
      }

      // Return the first validation error message
      const message = _.find(validate, (v) => v({ data, meta }));

      if (message) {
        error = new Error(message);

        dispatch({ type: types.FAIL, payload: { message }});
        reject(error);

        return;
      }

      dispatch({ type: types.SUCCESS, payload: { data }});
      resolve(data);
    },
    error: (error) => {
      dispatch({ type: types.FAIL, payload: { message: error.message }});
      reject(error);
    },
    header: true,
    skipEmptyLines: true
  }));
};
