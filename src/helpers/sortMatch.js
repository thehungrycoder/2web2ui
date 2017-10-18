import _ from 'lodash';
import { basicScorer, objectScorer } from './sortMatchScorers';
const identity = (a) => a;
const objectPatternRegex = /([^\s]+:[^\s"]+)/g;
const objectPatternExactRegex = /([^\s]+):"([^"]+)"/g;
const enclosingQuotesRegex = /^"?([^"]+)"?$/;

export function filterAndSortByScore(list) {
  return list.filter(([score]) => score > 0)
    .sort((a, b) => b[0] - a[0])
    .map(([score, item]) => item);
}

/**
 * Converts a list of colon-separated pairs
 * into a key/value hash
 * @param {Array} list
 *
 */
function convertPairsToHash(list = []) {
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

  if (!matches.length && !exactMatches.length) {
    return {};
  }

  return convertPairsToHash([ ...matches, ...exactMatches ]);
});

export default function sortMatch(items, pattern, getter = identity) {
  const scoredItems = items.map((item) => {
    const haystack = getter(item);
    const score = basicScorer(haystack, pattern);
    return [score, item];
  });
  return filterAndSortByScore(scoredItems);
}

// TODO: should we memoize somehow?
// TODO: key translation to not force people to know key returned by API (e.g. short_key vs key, label vs name)
export function objectSortMatch({ items, pattern, getter, keyMap = {}}) {
  const objectPattern = getObjectPattern(pattern);
  if (objectPattern && Object.keys(objectPattern)) {
    const scoredItems = items.map((item) => {
      const score = objectScorer({ item, objectPattern, keyMap }) || basicScorer(getter(item), pattern);
      return [score, item];
    });
    return filterAndSortByScore(scoredItems);
  }

  return sortMatch(items, pattern, getter);
}
