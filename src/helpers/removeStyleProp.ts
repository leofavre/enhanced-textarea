import { AttrValue, Possibly } from '../types';

const removeStyleProp = (propName: string) => {
  return (styleStr?: AttrValue): Possibly<string> =>
    styleStr != null && styleStr.replace
      ? styleStr
        .replace(new RegExp(`(^| |;)${propName}:.*?(;|$)`, 'g'), '$1')
        .replace(/  +/g, ' ')
        .trim()
      : styleStr || undefined;
};

export default removeStyleProp;
