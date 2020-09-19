import { isValidHex, isValidRgba, rgbaToArray } from 'hex-and-rgba';

export const getIndexActiveTag = (value: string) => {
  let tab = 0;

  if (value) {
    if (value === 'transparent') {
      tab = 0;
      return tab;
    }
    if (isValidHex(value)) {
      tab = 0;
      return tab;
    }
    const rgba = rgbaToArray(value);
    if (rgba) {
      if (isValidRgba(rgba[0], rgba[1], rgba[2])) {
        tab = 0;
        return tab;
      }
    } else {
      tab = 1;
      return tab;
    }
  }

  return tab;
};
