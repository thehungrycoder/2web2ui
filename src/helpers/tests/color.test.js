import * as color from '../color';

it('Should generate colors', () => {
  const arr = [{ name: '1' }, { name: '2' }];
  expect(color.generateColors(arr)).toMatchSnapshot();
});

it('Should generate colors, with custom options', () => {
  const arr = [{ name: '1' }, { name: '2' }, { name: '3' }];
  expect(color.generateColors(arr, { color: '#123456', saturate: 0, rotate: 150 })).toMatchSnapshot();
});
