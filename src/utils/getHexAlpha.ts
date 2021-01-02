import tinycolor from 'tinycolor2';

import { rgbaToArray, rgbaToHex } from '../utils';

export default (value: string) => {
  const defaultObject = {
    hex: '#ffffff',
    alpha: 100,
  };
  let tinyColor = tinycolor(value);

  if (value) {
    if (tinyColor.isValid()) {
      defaultObject.hex = tinyColor.toHexString();
      defaultObject.alpha = Math.round(tinyColor.getAlpha() * 100);
    } else {
      const rgbaArray = rgbaToArray(value);
      if (rgbaArray) {
        const hex = rgbaToHex([rgbaArray[0], rgbaArray[1], rgbaArray[2]]);
        if (hex) {
          defaultObject.hex = hex;
        }

        if (rgbaArray[3] !== 1) {
          defaultObject.alpha = Math.round(rgbaArray[3] * 100);
        } else {
          defaultObject.alpha = 100;
        }
      }
    }
  }

  return defaultObject;
};
