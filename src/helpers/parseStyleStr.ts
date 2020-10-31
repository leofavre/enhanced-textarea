interface IparseStyleStr {
  (styleStr: string): string
}

const parseStyleStr: IparseStyleStr = (styleStr) => {
  return styleStr
    .replace(/  +/g, ' ')
    .trim()
    .replace(/ ;/g, ';')
    .replace(/: /g, ':')
    .replace(/;$/, '')
    .split('; ')
    .sort()
    .join(';')
    .replace(/$/, ';');
};

export default parseStyleStr;
