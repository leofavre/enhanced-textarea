const removeStyleProp = propName => styleStr =>
  styleStr != null && styleStr.replace
    ? styleStr
      .replace(new RegExp(`(^| |;)${propName}:.*?(;|$)`, 'g'), '$1')
      .replace(/  +/g, ' ')
      .trim()
    : styleStr;

export default removeStyleProp;
