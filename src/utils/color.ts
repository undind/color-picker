import tinycolor, { Instance } from 'tinycolor2';

interface IInput {
  h: number;
  s: number;
  v: number;
}

export interface ITinyColor {
  color: any;
  alphaValue: number;
  blueValue: number;
  brightnessValue: number;
  greenValue: number;
  hueValue: number;
  lightnessValue: number;
  saturationValue: number;
  redValue: number;
  isValidHex(hex: string): any;
  initRgb(): any;
  initHsb(): any;
  toHexString(): any;
  toRgbString(): any;
  hex(): any;
  hue(): any;
  saturation(): any;
  lightness(): any;
  brightness(): any;
  red(): any;
  green(): any;
  blue(): any;
  alpha(): any;
  RGB(): any;
  HSB(): any;
}

export default class Color {
  color: Instance;
  alphaValue: number;
  blueValue: number;
  brightnessValue: number;
  greenValue: number;
  hueValue: number;
  lightnessValue: number;
  saturationValue: number;
  redValue: number;

  constructor(input: IInput | string) {
    this.color = tinycolor(input);

    this.initRgb();
    this.initHsb();

    const initAlpha = this.color.toRgb().a;
    this.alphaValue = Math.min(1, initAlpha) * 100;

    this.blueValue = 0;
    this.brightnessValue = 0;
    this.greenValue = 0;
    this.hueValue = 0;
    this.lightnessValue = 0;
    this.saturationValue = 0;
    this.redValue = 0;
  }

  static isValidHex(hex: string) {
    return tinycolor(hex).isValid();
  }

  initRgb = () => {
    const { r, g, b } = this.color.toRgb();

    this.redValue = r;
    this.greenValue = g;
    this.blueValue = b;
  };

  initHsb = () => {
    const { h, s, v } = this.color.toHsv();

    this.hueValue = h;
    this.saturationValue = s;
    this.brightnessValue = v;
  };

  toHexString = () => {
    return this.color.toHexString();
  };

  toRgbString = () => {
    return this.color.toRgbString();
  };

  get hex() {
    return this.color.toHex();
  }

  set hue(value) {
    this.color = tinycolor({
      h: value,
      s: this.saturation,
      v: this.brightness,
    });

    this.initRgb();
    this.hueValue = value;
  }

  get hue() {
    return this.hueValue;
  }

  set saturation(value) {
    this.color = tinycolor({
      h: this.hue,
      s: value,
      v: this.brightness,
    });

    this.initRgb();
    this.saturationValue = value;
  }

  get saturation() {
    return this.saturationValue;
  }

  set lightness(value) {
    this.color = tinycolor({
      h: this.hue,
      s: this.saturation,
      l: value,
    });

    this.initRgb();
    this.lightnessValue = value;
  }

  get lightness() {
    return this.lightnessValue;
  }

  set brightness(value) {
    this.color = tinycolor({
      h: this.hue,
      s: this.saturation,
      v: value,
    });

    this.initRgb();
    this.brightnessValue = value;
  }

  get brightness() {
    return this.brightnessValue;
  }

  // red
  set red(value) {
    const rgb = this.color.toRgb();
    this.color = tinycolor({
      ...rgb,
      r: value,
    });

    this.initHsb();
    this.redValue = value;
  }

  get red() {
    return this.redValue;
  }

  // green
  set green(value) {
    const rgb = this.color.toRgb();
    this.color = tinycolor({
      ...rgb,
      g: value,
    });

    this.initHsb();
    this.greenValue = value;
  }

  get green() {
    return this.greenValue;
  }

  // blue
  set blue(value) {
    const rgb = this.color.toRgb();
    this.color = tinycolor({
      ...rgb,
      b: value,
    });

    this.initHsb();
    this.blueValue = value;
  }

  get blue() {
    return this.blueValue;
  }

  // alpha
  set alpha(value) {
    this.color.setAlpha(value / 100);
  }

  get alpha() {
    return this.color.getAlpha() * 100;
  }

  get RGB() {
    return [this.red, this.green, this.blue];
  }

  get HSB() {
    return [this.hue, this.saturation, this.brightness];
  }
}
