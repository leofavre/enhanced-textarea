export default propName => styleStr => styleStr != null && styleStr.replace
  ? styleStr
    .replace(new RegExp(`${propName}:.*?;`, 'g'), '')
    .replace(/  +/g, ' ')
    .trim()
  : styleStr;
