/**
 * Returns the data:image/png;base64,<encoded> data URL
 * version of a JS File object
 *
 * @param {File} file object
 * @return {Promise -> String} data url of the file
 */
export function getDataUrl (file) {
  if (!(file instanceof File)) {
    return Promise.reject('Only native File objects can be converted to data URL');
  }

  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.addEventListener('load', () => resolve(reader.result));
    reader.readAsDataURL(file);
  });
}

/**
 * Returns only the base 64 encoded string version of a
 * JS File object, using the data URL API and stripping the prefix
 *
 * @param {File} file object
 * @return {Promise -> String} base 64 encoded contents of the file
 */
export function getBase64Contents (file) {
  return getDataUrl(file).then((dataUrl) => dataUrl.replace(/^data:.*\/.*;base64,/, ''));
}
