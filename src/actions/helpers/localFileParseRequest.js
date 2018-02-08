import Papa from 'papaparse';

export default ({ meta, type, parser = Papa }) => async(dispatch) => {
  const types = {
    PENDING: `${type}_PENDING`,
    SUCCESS: `${type}_SUCCESS`,
    FAIL: `${type}_FAIL`
  };

  dispatch({ type: types.PENDING });

  return await new Promise((resolve, reject) => parser.parse(meta.file, {
    complete: ({ data, errors }) => {
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
      } else {
        dispatch({ type: types.SUCCESS, payload: { data }});
        resolve(data);
      }
    },
    error: (error) => {
      dispatch({ type: types.FAIL, payload: { message: error.message }});
      reject(error);
    },
    header: true,
    skipEmptyLines: true
  }));
};
