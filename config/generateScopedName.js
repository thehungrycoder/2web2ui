'use strict';

const incstr = require('incstr');

const createUniqueIdGenerator = () => {
  const index = {};

  // Removed "d" letter to avoid accidental "ad" construct - for ad blockers
  const generateNextId = incstr.idGenerator({
    alphabet: 'ABCEFGHIJKLMNOPQRSTUVWXYZabcefghijklmnopqrstuvwxyz0123456789'
  });

  return (name) => {
    if (index[name]) {
      return index[name];
    }

    let nextId;

    do {
      // Class name cannot start with a number.
      nextId = generateNextId();
    } while (/^[0-9]/.test(nextId));

    index[name] = generateNextId();

    return index[name];
  };
};

const uniqueIdGenerator = createUniqueIdGenerator();

module.exports = function(localName, filePath) {
  // Matchbox uses the same generator to reduce class names
  // Prefix classes with APP_ to not overlap
  return `APP_${uniqueIdGenerator(filePath)}_${uniqueIdGenerator(localName)}`;
};
