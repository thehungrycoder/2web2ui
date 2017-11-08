function slugify(value) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .replace(/\s+/g, '-')
    .toLowerCase();
}

function snakeToCamel(string) {
  return string.replace(/(\_\w)/g, (matches) => matches[1].toUpperCase());
}

export {
  slugify,
  snakeToCamel
};
