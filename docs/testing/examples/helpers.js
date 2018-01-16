import { formatColor } from './_example-mocks';

export function sumKeys({ list, key }) {
  return list.reduce((sum, item) => sum + (Number(item[key]) || 0), 0);
}

export function formatObject({ id, fname, lname, color }) {
  return {
    id: id.toUpperCase(),
    name: `${fname} ${lname}`,
    color: formatColor(color)
  };
}
