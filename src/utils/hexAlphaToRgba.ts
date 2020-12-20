import { isValidHex } from '../utils';
import getAlphaHex from './getAlphaHex';
import hexToRgba from './hexToRgba';

interface IPicker {
  hex: string;
  alpha: number;
}

export default (picker: IPicker) => {
  if (picker) {
    const hexAlpha = getAlphaHex(picker.alpha);

    if (isValidHex(`${picker.hex}${hexAlpha}`)) {
      let rgba = hexToRgba(picker.hex, picker.alpha);

      if (rgba) {
        return rgba;
      }
    }
  }

  return '';
};
