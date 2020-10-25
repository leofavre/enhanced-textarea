export interface IParseStyleStr {
  (s: string): string
}

const parseStyleStr:IParseStyleStr = (styleStr) => {
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
