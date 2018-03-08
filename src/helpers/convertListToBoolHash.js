/**
 * Takes a list of string values and converts it
 * to a hash where each string is a key with a true value
 *
 * @param {Array} list A list of strings
 * @example
 * convertListToBoolHash(['one', 'four'])
 *   -> { one: true, four: true }
 */
export default function convertListToBoolHash(list = []) {
  return list.reduce((acc, value) => {
    acc[value] = true;
    return acc;
  }, {});
}
