interface IremoveStyleProp {
  (propName: string): (styleStr: string | null) => string | null
}

const removeStyleProp: IremoveStyleProp = propName => styleStr => {
  return styleStr != null && styleStr.replace
    ? styleStr
      .replace(new RegExp(`(^| |;)${propName}:.*?(;|$)`, 'g'), '$1')
      .replace(/  +/g, ' ')
      .trim()
    : styleStr || null;
};

export default removeStyleProp;
