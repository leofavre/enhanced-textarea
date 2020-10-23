import removeStyleProp from './removeStyleProp';
import { AttrValue } from '../types';

type Args = [AttrValue?, AttrValue?]

const ignoreHeight = removeStyleProp('height');
const ignoreMinHeight = removeStyleProp('min-height');

const parseStyle = (styleStr: string): string => {
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

const hasStyleExceptHeightChanged = (...args: Args): boolean => {
  const [prevStyle, nextStyle] = args;
  if (prevStyle == null || nextStyle == null) {
    return false;
  }

  return ignoreHeight(ignoreMinHeight(parseStyle(prevStyle))) !==
    ignoreHeight(ignoreMinHeight(parseStyle(nextStyle)));
};

export default hasStyleExceptHeightChanged;
