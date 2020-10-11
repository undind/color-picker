import { isValidHex, rgbaToArray } from 'hex-and-rgba';

import { hexToRgba } from '../utils';

function* matchAll(content: any, regexp: any, group = -1) {
  for (let match; (match = regexp.exec(content)); ) {
    yield ~group ? match[group].trim() : match.map((v: any) => v.trim());
  }
}

const match = (content: any, regexp: any, group = -1) => {
  const match = content.match(regexp);
  return match ? (~group ? match[group] : match) : null;
};

export default (str: string) => {
  const defaultStops = {
    stops: [
      ['rgba(0, 0, 0, 1)', 0],
      ['rgba(183, 80, 174, 0.92)', 1],
    ],
    gradient: `linear-gradient(180deg, rgba(6, 6, 6, 1) 0.0%, rgba(183, 80, 174, 0.92) 100.0%)`,
    modifier: 180,
    type: 'linear',
  };

  if (str === 'transparent') {
    return defaultStops;
  }

  if (isValidHex(str)) {
    const rgbaStr = hexToRgba(str, 100);
    const rgbaArr = rgbaToArray(rgbaStr);

    if (rgbaArr) {
      defaultStops.stops = [
        ['rgba(0, 0, 0, 1)', 0],
        [`rgba(${rgbaArr[0]}, ${rgbaArr[1]}, ${rgbaArr[2]}, 1)`, 1],
      ];
      defaultStops.gradient = `linear-gradient(180deg, rgba(6, 6, 6, 1) 0.0%, rgba(${rgbaArr[0]}, ${rgbaArr[1]}, ${rgbaArr[2]}, 1) 100.0%)`;
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
        .map((v: any) => match(v, /^-?(\d*(\.\d+)?)%$/, 1))
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
