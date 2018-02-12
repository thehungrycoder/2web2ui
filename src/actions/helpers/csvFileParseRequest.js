import Papa from 'papaparse';

export const hasData = ({ data }) => {
  if (data.length === 0) {
    return 'No data was found';
  }
};

export const hasField = (...expectedFields) => ({ meta: { fields }}) => {
  if (!expectedFields.some((field) => fields.includes(field))) {
    return `Missing required field: ${expectedFields[0]}`;
  }
};

export default ({ meta: { file, validate = []}, type, parser = Papa }) => async(dispatch) => {
  const types = {
    PENDING: `${type}_PENDING`,
    SUCCESS: `${type}_SUCCESS`,
    FAIL: `${type}_FAIL`
  };

  dispatch({ type: types.PENDING });

  return await new Promise((resolve, reject) => parser.parse(file, {
    complete: ({ data, errors, meta }) => {
      if (errors.length > 0) {
        const error = new Error('An error occurred while parsing your file.');

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

      // Return validation error messages as array
      const validationErrors = validate.map((v) => v({ data, meta })).filter((message) => !!message);

      if (validationErrors.length) {
        const error = new Error(validationErrors.join(' / '));

        dispatch({ type: types.FAIL, payload: { message: error.message }});
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
