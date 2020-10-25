interface IParseStyleStr {
  (s: string): string
}

const parseStyleStr:IParseStyleStr = (styleStr) => {
  return styleStr
    .replace(/  +/g, ' ')
    .replace(/ ;/g, ';')
    .trim()
    .replace(/;$/g, '')
    .replace(/:([^ ])/g, ': $1')
    .split('; ')
    .sort()
    .join(';')
    .replace(/$/g, ';');
};

export default parseStyleStr;
