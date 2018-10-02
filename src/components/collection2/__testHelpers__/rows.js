export function mkRow(i = 0) {
  return { id: i, name: `row-name-${Math.floor(i / 5)}-${i}` };
}

export function mkRows(n) {
  const rows = [];
  for (let i = 0; i < n; i++) {
    rows.push(mkRow(i));
  }
  return rows;
}
