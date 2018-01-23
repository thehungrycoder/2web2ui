import Papa from 'papaparse';

// Adapted minimally from parseRecipientList() in webui/src/app/recipients/recipients-controller.js
const parseRawRecords = (results, resolve, reject) => {
  const mapped = [];
  const errors = [];

  const parseJSONField = (field, datum, out, line, errors) => {
    if (datum[field]) {
      try {
        out[field] = JSON.parse(datum[field]);
      } catch (e) {
        // e is a SyntaxError
        errors.push(`Error parsing ${field} on line #'${line}: invalid JSON: ${e.message}`);
      }
    }
  };

  // map each field
  results.data.forEach((datum, index) => {
    const line = index + 2;
    const out = {};
    const preErrorCount = errors.length;

    // email is required
    if (datum.email) {
      out.address = { email: datum.email };
    } else {
      errors.push(`Error parsing line #${line}: email field is missing`);
    }

    // these fields are optional, but should display errors if invalid parsing
    parseJSONField('metadata', datum, out, line, errors);
    parseJSONField('substitution_data', datum, out, line, errors);
    parseJSONField('tags', datum, out, line, errors);

    // NOTE: the old UI stopped parsing after a single error here.
    // We continue to collect errors

    if (datum.return_path) {
      out.return_path = datum.return_path;
    }

    if (datum.name && out.address) {
      out.address.name = datum.name;
    }

    if (preErrorCount === errors.length) {
      mapped.push(out);
    }
  });

  if (errors.length === 0) {
    return resolve(mapped);
  }

  return reject(errors);
};

const parseRecipientListCsv = (file) => new Promise((resolve, reject) => {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: (result) => parseRawRecords(result, resolve, reject),
    error: (err) => reject(err)
  });
});
export default parseRecipientListCsv;

