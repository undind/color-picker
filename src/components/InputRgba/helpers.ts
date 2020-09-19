import { KeyboardEvent, ChangeEvent } from 'react';
import { isValidHex } from 'hex-and-rgba';
import _ from 'lodash';
import { hexToRgba } from '../../utils';

interface IInput {
  alphaValue: number;
  hexValue: string;
  onChangeAlpha: (value: string) => void;
  onChangeHex: (value: string) => void;
}

interface IPicker {
  hex: string;
  alpha: number;
}

export const validateHex = (hex: string) => {
  if (hex && hex.length) {
    const validHEX = hex.replace('#', '');
    return validHEX;
  }
};

export const getAlphaValue = (value: string) => {
  value.replace(/%/i, '');
  if (value[0] === '0' && value.length > 1) {
    return value.substr(1);
  } else if (Number(value) >= 100) {
    return 100;
  } else if (!isNaN(Number(value))) {
    return value || 0;
  }
  return parseInt(value);
};

export const getHexValue = (color: string) => {
  const baseColor = 'ffffff';
  if (!color || typeof color !== 'string') return baseColor;

  if (color.substring(0, 1) === '#') color = color.substring(1);

  switch (color.length) {
    // case 3: if (/^[0-9A-F]{3}$/i.test(color)) return color; break;
    case 6:
      if (/^[0-9A-F]{6}$/i.test(color)) return color;
      break;
    // case 8: if (/^[0-9A-F]{8}$/i.test(color)) return color; break;
    default:
      return baseColor;
  }
};

export const onlyDigits = (string: string) => {
  return string ? string.substr(0, 3).replace(/[^\d]/g, '') : '';
};

export const onlyLatins = (string: string) => {
  if (string && string.substring(0, 1) === '#') string = string.substring(1);
  return string ? string.substr(0, 6).replace(/[^a-zA-Z0-9\s-]/gi, '') : '';
};

export const handlePressEnter = (e: KeyboardEvent, fn: () => void) => {
  if (e.key === 'Enter') {
    fn();
  }
};

// DATA FOR INPUTS
export const inputsData = (props: IInput) => {
  return [
    {
      wrapClass: 'sommerce-editor__elements-input_rgba-hex',
      labelSymbol: true,
      idInput: 'rgba-hex',
      valueInput: props.hexValue,
      labelText: 'Hex',
      labelClass: 'sommerce-editor__elements-input_rgba-label',
      onChangeInput: (e: ChangeEvent<HTMLInputElement>) => props.onChangeHex(onlyLatins(e.target.value)),
      name: 'hex',
    },
    {
      wrapClass: 'sommerce-editor__elements-input_rgba-alpha',
      labelSymbol: false,
      idInput: 'rgba-alpha',
      valueInput: props.alphaValue,
      labelText: 'Alpha',
      labelClass: 'sommerce-editor__elements-input_rgba-label',
      onChangeInput: (e: ChangeEvent<HTMLInputElement>) => props.onChangeAlpha(onlyDigits(e.target.value)),
      name: 'alpha',
    },
  ];
};

export const getPercentLabelPosition = (valueInput: string) => {
  return String(valueInput).length === 1 ? '40px' : String(valueInput).length === 2 ? '32px' : '24px';
};

export const hexAlphaToRgba = (picker: IPicker) => {
  if (picker) {
    if (isValidHex(`${picker.hex}`)) {
      let rgba = hexToRgba(picker.hex, picker.alpha);

      if (rgba) {
        return rgba;
      }
    }
  }

  return false;
};

export const getAlphaHex = (value: number) => {
  if (_.isNumber(value)) {
    let alphaHEX = '';
    for (var i = 1; i >= 0; i -= 0.01) {
      i = Math.round(i * 100) / 100;
      var alpha = Math.round(i * 255);
      var hex = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
      var perc = Math.round(i * 100);

      if (perc === value) {
        alphaHEX = hex;
        break;
      }
    }

    return alphaHEX;
  }
  return new Error('alpha error');
};
