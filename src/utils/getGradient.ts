export default (type: string, stops: any, modifier: any) => {
  switch (type) {
    case 'linear':
      if (typeof modifier === 'number')
        return `linear-gradient(${modifier}deg, ${stops.map(
          (color: [string, number]) => `${color[0]} ${Math.round(color[1] * 100).toFixed(2)}%`
        )})`;
      if (typeof modifier === 'string')
        return `linear-gradient(${modifier}, ${stops.map(
          (color: [string, number]) => `${color[0]} ${Math.round(color[1] * 100).toFixed(2)}%`
        )})`;
      break;
    case 'radial':
      return `radial-gradient(${modifier}, ${stops.map(
        (color: [string, number]) => `${color[0]} ${Math.round(color[1] * 100).toFixed(2)}%`
      )})`;
    default:
      break;
  }
};
