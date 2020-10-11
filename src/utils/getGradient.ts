export default (type: string, stops: any, modifier: any) => {
  switch (type) {
    case 'linear':
      if (typeof modifier === 'number')
        return `linear-gradient(${modifier}deg, ${stops.map(
          (color: [string, number]) => `${color[0]} ${color[1] * 100}%`
        )})`;
      if (typeof modifier === 'string')
        return `linear-gradient(${modifier}, ${stops.map(
          (color: [string, number]) => `${color[0]} ${color[1] * 100}%`
        )})`;
    case 'radial':
      return `radial-gradient(${modifier}, ${stops.map(
        (color: [string, number]) => `${color[0]} ${color[1] * 100}%`
      )})`;
    default:
      break;
  }
};
