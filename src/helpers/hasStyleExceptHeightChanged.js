import removeStyleProp from './removeStyleProp.js';

const ignoreHeight = removeStyleProp('height');
const ignoreMinHeight = removeStyleProp('min-height');

const parseStyle = styleStr => styleStr
  .replace(/  +/g, ' ')
  .replace(/ ;/g, ';')
  .trim()
  .replace(/;$/g, '')
  .replace(/:([^ ])/g, ': $1')
  .split('; ')
  .sort()
  .join(';')
  .replace(/$/g, ';');

const hasStyleExceptHeightChanged = (prevStyle, nextStyle) => {
  if (prevStyle == null || nextStyle == null) {
    return false;
  }

  return ignoreHeight(ignoreMinHeight(parseStyle(prevStyle))) !==
    ignoreHeight(ignoreMinHeight(parseStyle(nextStyle)));
};

export default hasStyleExceptHeightChanged;
