import removeStyleProp from './removeStyleProp';
import parseStyleStr from './parseStyleStr';

export interface IHasStyleExceptHeightChanged {
  (pastStyle: string | null, nextStyle: string | null): boolean
}

const ignoreHeight = removeStyleProp('height');
const ignoreMinHeight = removeStyleProp('min-height');

const hasStyleExceptHeightChanged: IHasStyleExceptHeightChanged = (...args) => {
  const [pastStyle, nextStyle] = args;
  if (pastStyle == null || nextStyle == null) {
    return false;
  }

  return ignoreHeight(ignoreMinHeight(parseStyleStr(pastStyle))) !==
    ignoreHeight(ignoreMinHeight(parseStyleStr(nextStyle)));
};

export default hasStyleExceptHeightChanged;
