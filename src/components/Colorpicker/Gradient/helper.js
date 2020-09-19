import { isValidHex, rgbaToArray } from 'hex-and-rgba';
import _ from 'lodash';

export const hexAlphaToRgba = (picker) => {
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

export const getAlphaHex = (value) => {
  if (_.isNumber(value)) {
    let alphaHEX = '';
    for (var i = 1; i >= 0; i -= 0.01) {
      i = Math.round(i * 100) / 100;
      var alpha = Math.round(i * 255);
      var hex = (alpha + 0x10000)
        .toString(16)
        .substr(-2)
        .toUpperCase();
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

const hexToRgba = (hexVal, opacityVal) => {
  let opacity = isNaN(opacityVal) ? 100 : opacityVal;
  let hex = hexVal.replace('#', '');
  let r;
  let g;
  let b;

  if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    let rd = hex.substring(0, 1) + hex.substring(0, 1);
    let gd = hex.substring(1, 2) + hex.substring(1, 2);
    let bd = hex.substring(2, 3) + hex.substring(2, 3);
    r = parseInt(rd, 16);
    g = parseInt(gd, 16);
    b = parseInt(bd, 16);
  }

  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + opacity / 100 + ')';
};

export const stopsToString = (stops, mode) => {
  const stopsMap = stops.map((v) => ({
    color: v[0],
    location: v[1],
  }));

  switch (mode) {
    case 'linear':
    case 'radial':
      return stopsMap.map((v) => `${v.color} ${(v.location * 100).toFixed(1)}%`).join(',');
    case 'conic':
      return stopsMap.map((v) => `${v.color} ${(v.location * 360).toFixed(1)}deg`).join(',');
  }

  return stopsMap;
};

export const formatGradient = (stops, mode, angle, direction) => {
  const linearString = stopsToString(stops, mode);

  switch (mode) {
    case 'linear':
      if (angle === 'number') return `linear-gradient(${angle}deg, ${linearString})`;
      if (angle === 'string') return `linear-gradient(${angle}, ${linearString})`;
    case 'radial':
      return `radial-gradient(${direction}, ${linearString})`;
    case 'conic':
      return `conic-gradient(${linearString})`;
  }
};

function* matchAll(content, regexp, group = -1) {
  for (let match; (match = regexp.exec(content)); ) {
    yield ~group ? match[group].trim() : match.map((v) => v.trim());
  }
}

const match = (content, regexp, group = -1) => {
  const match = content.match(regexp);
  return match ? (~group ? match[group] : match) : null;
};

export const parseGradient = (str) => {
  const defaultStops = {
    stops: [
      ['rgba(0, 0, 0, 1)', 0],
      ['rgba(183, 80, 174, 0.92)', 1],
    ],
    gradient: `linear-gradient(0deg, rgba(6, 6, 6, 1) 0%, 0deg, rgba(183, 80, 174, 0.92) 100%)`,
    modifier: 180,
    type: 'linear',
  };

  if (str === 'transparent') {
    return defaultStops;
  }

  if (isValidHex(str)) {
    const rgbaStr = hexToRgba(str);
    const rgbaArr = rgbaToArray(rgbaStr);

    if (rgbaArr) {
      defaultStops.stops = [
        ['rgba(0, 0, 0, 1)', 0],
        [`rgba(${rgbaArr[0]}, ${rgbaArr[1]}, ${rgbaArr[2]}, 1)`, 1],
      ];
      defaultStops.gradient = `linear-gradient(0deg, rgba(6, 6, 6, 1) 0%, 0deg, rgba(${rgbaArr[0]}, ${rgbaArr[1]}, ${rgbaArr[2]}, 1) 100%)`;
    }

    return defaultStops;
  } else {
    // Clean gradient
    str = str.replace(';', '').replace('background-image:', '');

    // Resolve gradient type and stop strings
    const [, type, content] = str.match(/^(\w+)-gradient\((.*)\)$/i) || [];
    if (!type || !content) {
      return defaultStops;
    }

    const rawstops = [...matchAll(content, /(rgba?\(.*?\)|#?\w+)(.*?)(?=,|$)/gi)];
    const stops = [];
    let modifier = null;

    // Parse raw stop strings
    let lastColor = null;
    for (let i = 0; i < rawstops.length; i++) {
      const [full, rc, rl] = rawstops[i];

      const locs = rl
        .split(/\s+/g)
        .map((v) => match(v, /^-?(\d*(\.\d+)?)%$/, 1))
        .filter(Boolean)
        .map(Number);

      if (locs.length) {
        for (const loc of locs) {
          stops.push({
            loc: parseInt(loc, 10) / 100,
            color: rc || lastColor,
          });
        }
      } else if (!modifier) {
        modifier = full;
      }

      lastColor = rc || lastColor;
    }

    if (!stops[stops.length - 1].loc) {
      stops[stops.length - 1].loc = 1;
    }

    // Compute gaps
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];

      if (!stop.loc) {
        if (!i) {
          stop.loc = 0;
        } else {
          let divider = 2;
          let j = i + 1;

          for (; j < stops.length && !stops[j].loc; j++) {
            divider++;
          }

          stop.loc = stops[i - 1].loc + (stops[j].loc - stops[i - 1].loc) / divider;
        }
      }
    }

    return {
      gradient: str,
      type,
      modifier: modifier.match(/\d+/) !== null ? Number(modifier.match(/\d+/)[0]) : modifier,
      stops: stops.map((stop) => [`${stop.color}`, stop.loc]),
    };
  }
};
