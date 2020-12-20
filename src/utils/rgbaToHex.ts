export default (params: any) => {
  if (!Array.isArray(params)) return '';

  if (params.length < 3 || params.length > 4) return '';

  if (params.length === 4) params[3] = Math.floor(255 * params[3]);

  const parts = params.map(function (e: any) {
    let r = (+e).toString(16);
    r.length === 1 && (r = '0' + r);
    return r;
  }, []);

  return !~parts.indexOf('NaN') ? '#' + parts.join('') : '';
};
