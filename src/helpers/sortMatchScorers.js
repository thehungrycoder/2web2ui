import _ from 'lodash';

const defaultKeyMap = {
  subaccount: 'subaccount_id'
};

export function basicScorer(haystack, needle) {
  haystack = haystack.toString();
  needle = needle.toString();

  if (needle.length > haystack.length) {
    return 0;
  }

  // case-sensitive exact match
  if (haystack === needle) {
    return 10;
  }

  const lcHaystack = haystack.toLowerCase();
  const lcNeedle = needle.toLowerCase();

  // case-insensitive exact match
  if (lcHaystack === lcNeedle) {
    return 9;
  }

  // starts with case-sensitive needle
  if (haystack.startsWith(needle)) {
    return 8;
  }

  // starts with case-insensitive needle
  if (lcHaystack.startsWith(lcNeedle)) {
    return 7;
  }

  // word starts with needle, e.g. something needle
  const afterSpace = lcHaystack.includes(` ${lcNeedle}`);
  if (afterSpace) {
    return 6;
  }

  // needle found after - or _ e.g. something-needle
  const afterDash = lcHaystack.includes(`-${lcNeedle}`);
  const afterUnderscore = lcHaystack.includes(`_${lcNeedle}`);
  if (afterDash || afterUnderscore) {
    return 5;
  }

  // 3-character needle contained in haystack at all
  // (can also be 1 or 2 character needle if haystack is short)
  const threshold = Math.min(Math.ceil(lcHaystack.length / 4), 3);
  if (lcNeedle.length >= threshold && lcHaystack.includes(lcNeedle)) {
    return 4;
  }

  return 0;
}

export function objectScorer({ item, objectPattern, keyMap }) {
  const mergedKeyMap = { ...defaultKeyMap, ...keyMap };
  const mappedKeys = _.mapKeys(objectPattern, (v, key) => mergedKeyMap[key] || key);
  const mergedObjectPattern = { ...objectPattern, ...mappedKeys }; // leaves original keys alongside mapped keys
  const keys = _.intersection(Object.keys(item), Object.keys(mergedObjectPattern));
  return keys.reduce((score, key) => score + basicScorer(item[key], mergedObjectPattern[key]), 0);
}
