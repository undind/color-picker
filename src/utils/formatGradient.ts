const stopsToString = (stops: any, mode: any) => {
  const stopsMap = stops.map((v: any) => ({
    color: v[0],
    location: v[1],
  }));

  switch (mode) {
    case 'linear':
    case 'radial':
      return stopsMap.map((v: any) => `${v.color} ${(v.location * 100).toFixed(1)}%`).join(',');
    case 'conic':
      return stopsMap.map((v: any) => `${v.color} ${(v.location * 360).toFixed(1)}deg`).join(',');
    default:
      break;
  }

  return stopsMap;
};

export default (stops: any, mode: any, angle: any, direction: any) => {
  const linearString = stopsToString(stops, mode);

  switch (mode) {
    case 'linear':
      if (angle === 'number') return `linear-gradient(${angle}deg, ${linearString})`;
      if (angle === 'string') return `linear-gradient(${angle}, ${linearString})`;
      break;
    case 'radial':
      return `radial-gradient(${direction}, ${linearString})`;
    case 'conic':
      return `conic-gradient(${linearString})`;
    default:
      break;
  }
};
