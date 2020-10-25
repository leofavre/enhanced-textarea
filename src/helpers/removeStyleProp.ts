export interface IRemoveStyleProp {
  (propName: string): (styleStr: string | null) => string | null
}

const removeStyleProp: IRemoveStyleProp = propName => styleStr => {
  return styleStr != null && styleStr.replace
    ? styleStr
      .replace(new RegExp(`(^| |;)${propName}:.*?(;|$)`, 'g'), '$1')
      .replace(/  +/g, ' ')
      .trim()
    : styleStr || null;
};

export default removeStyleProp;
