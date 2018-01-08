import clr from 'color';

/**
 * Generates a color palette for pie chart data
 * @param  {[type]} arr       array of objects
 * @param  {[type]} baseColor
 * @param  {[type]} rotate    hue rotation multiplier, divided by array length
 * @param  {[type]} saturate  hue saturation multiplier, divided by array length
 * @return {[type]}           array with 'fill' key added
 */
export function generateColors(arr, { color = '#000000', rotate = null, saturate = null }) {
  const base = clr(color);
  const length = arr.length;
  const r = rotate === null ? 60 / length : rotate / length;
  const s = saturate === null ? 0.1 / length : saturate / length;

  return arr.map((item, i) => ({
    ...item,
    fill: base.rotate(r * i).saturate(s * i).string()
  }));
}
