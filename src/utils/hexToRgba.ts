export default (hexVal: string, opacityVal: number) => {
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
