import removeStyleProp from './removeStyleProp';
import parseStyleStr from './parseStyleStr';

export interface IHasStyleExceptHeightChanged {
  (prevStyle: string | null, nextStyle: string | null): boolean
}

const ignoreHeight = removeStyleProp('height');
const ignoreMinHeight = removeStyleProp('min-height');

const hasStyleExceptHeightChanged: IHasStyleExceptHeightChanged = (...args) => {
  const [prevStyle, nextStyle] = args;
  if (prevStyle == null || nextStyle == null) {
    return false;
  }

  return ignoreHeight(ignoreMinHeight(parseStyleStr(prevStyle))) !==
    ignoreHeight(ignoreMinHeight(parseStyleStr(nextStyle)));
};

export default hasStyleExceptHeightChanged;
