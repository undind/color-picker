import { hexToRgba, rgbaToArray, isValidHex } from '../utils';

function* matchAll(content: string, regexp: RegExp, group: number = -1) {
  for (let match; (match = regexp.exec(content)); ) {
    yield ~group ? match[group].trim() : match.map((v: any) => v.trim());
  }
}

const match = (content: string, regexp: RegExp, group: number = -1) => {
  const match = content.match(regexp);
  return match ? (~group ? match[group] : match) : null;
};

const LINEAR_POS = [
  { angle: '0', name: 'to top' },
  { angle: '45', name: 'to top right' },
  { angle: '45', name: 'to right top' },
  { angle: '90', name: 'to right' },
  { angle: '135', name: 'to right bottom' },
  { angle: '135', name: 'to bottom right' },
  { angle: '180', name: 'to bottom' },
  { angle: '225', name: 'to left bottom' },
  { angle: '225', name: 'to bottom left' },
  { angle: '270', name: 'to left' },
  { angle: '315', name: 'to top left' },
  { angle: '315', name: 'to left top' },
];

export default (str: string) => {
  const defaultStops = {
    stops: [
      ['rgba(0, 0, 0, 1)', 0, 0],
      ['rgba(183, 80, 174, 0.92)', 1, 1],
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
        ['rgba(0, 0, 0, 1)', 0, 0],
        [`rgba(${rgbaArr[0]}, ${rgbaArr[1]}, ${rgbaArr[2]}, 1)`, 1, 1],
      ];
      defaultStops.gradient = `linear-gradient(180deg, rgba(6, 6, 6, 1) 0.0%, rgba(${rgbaArr[0]}, ${rgbaArr[1]}, ${rgbaArr[2]}, 1) 100.0%)`;
    }

    return defaultStops;
  } else {
    str = str.replace(';', '').replace('background-image:', '');

    const [, type, content] = str.match(/^(\w+)-gradient\((.*)\)$/i) || [];
    if (!type || !content) {
      return defaultStops;
    }

    const rawstops = [...matchAll(content, /(rgba?\(.*?\)|#?\w+)(.*?)(?=,|$)/gi)];
    const stops = [];
    let modifier = null;

    let lastColor = null;
    for (let i = 0; i < rawstops.length; i++) {
      const [full, rc, rl] = rawstops[i];
      const findF = LINEAR_POS.find((item) => item.name === full)?.angle;
      const newFull = findF || full;

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
        modifier = newFull;
      }

      lastColor = rc || lastColor;
    }

    if (!stops[stops.length - 1].loc) {
      stops[stops.length - 1].loc = 1;
    }

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

    modifier = modifier || '180';

    return {
      gradient: str,
      type,
      modifier: modifier.match(/\d+/) !== null ? Number(modifier.match(/\d+/)[0]) : modifier,
      stops: stops.map((stop, index) => [`${stop.color}`, stop.loc, index]),
    };
  }
};
