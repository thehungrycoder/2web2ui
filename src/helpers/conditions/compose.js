export function all(...conditions) {
  return (args) => conditions.every((condition) => condition(args));
}

export function any(...conditions) {
  return (args) => conditions.some((condition) => condition(args));
}
