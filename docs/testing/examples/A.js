import b2, { b1 } from './B';

export default function myFunc(prefix) {
  return `${prefix} ${b1()} ${b2()}`;
}
