export default function(...conditions) {
  return (args) => conditions.every((condition) => condition(args));
}
