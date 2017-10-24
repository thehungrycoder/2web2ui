export function score(haystack, needle) {
  if (needle > haystack) {
    return 0;
  }

  // case-sensitive exact match
  if (haystack === needle) {
    return 10;
  }

  haystack = haystack.toLowerCase();
  needle = needle.toLowerCase();

  // case-insensitive exact match
  if (haystack === needle) {
    return 9;
  }

  // starts with needle
  if (haystack.startsWith(needle)) {
    return 8;
  }

  // word starts with needle, e.g. something needle
  const afterSpace = haystack.includes(` ${needle}`);
  if (afterSpace) {
    return 7;
  }

  // needle found after - or _ e.g. something-needle
  const afterDash = haystack.includes(`-${needle}`);
  const afterUnderscore = haystack.includes(`_${needle}`);
  if (afterDash || afterUnderscore) {
    return 6;
  }

  // 3-character needle contained in haystack at all
  if (needle.length > 2 && haystack.includes(needle)) {
    return 5;
  }

  return 0;
}

export default function sortMatch(items = [], needle, getter = (a) => a) {
  return items
    .map((item) => {
      const haystack = getter(item);
      return [score(haystack, needle), item];
    })
    .filter(([score]) => score > 0)
    .sort((a, b) => b[0] - a[0])
    .map(([score, item]) => item);
}
