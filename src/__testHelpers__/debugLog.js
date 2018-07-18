export default function debugLog(...args) {
  // eslint-disable-next-line no-console
  process.env.DEBUG && console.log(...args);
}
