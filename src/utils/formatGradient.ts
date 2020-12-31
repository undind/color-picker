const stopsToString = (stops: any, mode: string): string => {
  const stopsMap = stops.map((v: [string, number]) => ({
    color: v[0],
    location: v[1],
  }));

  switch (mode) {
    case 'linear':
    case 'radial':
      return stopsMap
        .map((v: { color: string; location: number }) => `${v.color} ${(v.location * 100).toFixed(1)}%`)
        .join(',');
    case 'conic':
      return stopsMap
        .map((v: { color: string; location: number }) => `${v.color} ${(v.location * 360).toFixed(1)}deg`)
        .join(',');
    default:
      break;
  }

  return stopsMap;
};

export default (stops: Array<any>, mode: string, angle: string | number, direction: string | number): string => {
  const linearString = stopsToString(stops, mode);

  let str = '';
  switch (mode) {
    case 'linear':
      if (angle === 'number') str = `linear-gradient(${angle}deg, ${linearString})`;
      if (angle === 'string') str = `linear-gradient(${angle}, ${linearString})`;
      break;
    case 'radial':
      str = `radial-gradient(${direction}, ${linearString})`;
      break;
    case 'conic':
      str = `conic-gradient(${linearString})`;
      break;
    default:
      break;
  }

  return str;
};
