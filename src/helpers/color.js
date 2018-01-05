import color from 'color';

/**
 * Generates a color palette for bounce chart data
 */
export function generateColors(arr, base) {
  const baseColor = color(base);
  const rotate = 60 / arr.length;
  const saturate = 0.1 / arr.length;
  return arr.map((item, i) => ({
    ...item,
    fill: baseColor.rotate(rotate * i).saturate(saturate * i).string()
  }));
}
