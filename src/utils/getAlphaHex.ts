import _ from 'lodash';

export default (value: number) => {
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
  return new Error('Alpha error');
};
