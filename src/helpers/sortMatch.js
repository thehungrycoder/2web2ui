import _ from 'lodash';
import { basicScorer, objectScorer } from './sortMatchScorers';
const identity = (a) => a;
const objectPatternRegex = /([^\s]+:[^\s"]+)/g;
const objectPatternExactRegex = /([^\s]+):"([^"]+)"/g;
const enclosingQuotesRegex = /^"?([^"]+)"?$/;

export function filterAndSortByScore(list, threshold = 0) {
  return list.filter(([score]) => score > threshold)
    .sort((a, b) => b[0] - a[0])
    .map(([score, item]) => item);
}

/**
 * Converts a list of colon-separated pairs
 * into a key/value hash
 * @param {Array} list
 *
 */
function convertPairsToHash(list) {
  const split = list.map((m) => m.split(':'));
  const keys = split.map((m) => m[0]);
  const values = split.map((m) => m[1].replace(enclosingQuotesRegex, '$1'));
  return _.zipObject(keys, values);
}

/**
 * Takes a string like ->
 * something first:thing another:"thing with spaces"
 *
 * and returns ->
 * {
 *   first: "thing",
 *   another: "thing with spaces"
 * }
 * @param {String} string
 */
export const getObjectPattern = _.memoize((string) => {
  const matches = string.match(objectPatternRegex) || [];
  const exactMatches = string.match(objectPatternExactRegex) || [];
  return convertPairsToHash([ ...matches, ...exactMatches ]);
});

export default function sortMatch(items, pattern, getter = identity, matchThreshold) {
  const scoredItems = items.map((item) => {
    const haystack = getter(item);
    const score = basicScorer(haystack, pattern);
    return [score, item];
  });
  return filterAndSortByScore(scoredItems, matchThreshold);
}

/**
 * Performs sort and match on a list of strings or objects
 *
 * @param {Array} items - list of strings or objects to be sorted and matched on
 * @param {String} pattern - pattern to search for
 * @param {function} getter - customer parser/stringifyer, e.g. to use for converting object values to strings
 * @param {object} [keyMap={}] - optional mapping of key names used by the object scorer
 * @param {number} [matchThreshold=0] - only include items whose match score is higher than this number
 * @param {function} [sorter] - sorts results after being sorted according to match score
 * @returns {Array} Matched and sorted results
 */
export function objectSortMatch({ items, pattern, getter, keyMap = {}, matchThreshold, primarySorter }) {
  const objectPattern = getObjectPattern(pattern);
  let filteredAndSorted = [];
  if (objectPattern && Object.keys(objectPattern).length) {
    const remainingPattern = pattern
      .replace(objectPatternRegex, '')
      .replace(objectPatternExactRegex, '')
      .trim();

    const scoredItems = items.map((item, i) => {
      const score = objectScorer({ item, objectPattern, keyMap }) + (remainingPattern ? basicScorer(getter(item), remainingPattern) : 0);
      return [score, item];
    });
    filteredAndSorted = filterAndSortByScore(scoredItems, matchThreshold);
  } else {
    filteredAndSorted = sortMatch(items, pattern, getter, matchThreshold);
  }

  return primarySorter ? primarySorter(filteredAndSorted) : filteredAndSorted;
}
