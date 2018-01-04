function snakeToFriendly(string) {
  return string
    .charAt(0).toUpperCase() + string.slice(1)
    .replace(/(_\w)/g, (matches) => ` ${matches[1].toUpperCase()}`);
}

function slugify(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function snakeToCamel(string) {
  return string.replace(/(_\w)/g, (matches) => matches[1].toUpperCase());
}

/**
 * Replace characters from the middle of a string with an ellipsis to make it
 * fit a given length.
 *
 * e.g. 'supercalafragilisticexpialidocious' -> 'super...ocious'
 *
 * @param {String} string - string to shorten
 * @param {Number} maxLen - final string length
 */
function shrinkToFit(string, targetLen) {
  const len = string.length;
  const chunkLen = (targetLen - 3) / 2;

  if (len <= targetLen || targetLen < 3) {
    return string;
  }

  return `${string.slice(0, chunkLen)}...${string.slice(len - chunkLen)}`;
}

export {
  snakeToFriendly,
  slugify,
  snakeToCamel,
  shrinkToFit
};
