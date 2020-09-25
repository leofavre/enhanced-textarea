import hasStyleExceptHeightChanged from '../helpers/hasStyleExceptHeightChanged.js';
import pxToNumber from '../helpers/pxToNumber.js';

const WithAutoHeight = (Base = class {}) => class extends Base {
  get textElement () {
    return this;
  }

  static get observedAttributes () {
    return [
      ...super.observedAttributes || [],
      ...['autoheight', 'rows', 'cols', 'class', 'style']
    ];
  }

  _handleAttributeChange (attrName, oldValue, nextValue) {
    if (oldValue !== nextValue) {
      if (attrName === 'autoheight') {
        if (oldValue == null) {
          this._handleAutoHeightStart();
        } else if (nextValue == null) {
          this._handleAutoHeightEnd();
        }
      }

      if (attrName !== 'style' ||
        hasStyleExceptHeightChanged(oldValue, nextValue)) {
        this._handleChange();
      }
    }
  }

  _handleAutoHeightStart () {
    const changeHandler = this._handleChange.bind(this);
    const resizeHandler = this._handleResize.bind(this);
    this._resizeObserver = new ResizeObserver(changeHandler);
    this._resizeObserver.observe(this.textElement);
    this.textElement.addEventListener('input', changeHandler);
    this.textElement.addEventListener('userresize', resizeHandler);
  }

  _handleAutoHeightEnd () {
    const changeHandler = this._handleChange.bind(this);
    const resizeHandler = this._handleResize.bind(this);
    this._resizeObserver && this._resizeObserver.unobserve(this.textElement);
    this.textElement.removeEventListener('input', changeHandler);
    this.textElement.removeEventListener('userresize', resizeHandler);
  }

  _handleChange () {
    if (this.textElement.hasAttribute('autoheight')) {
      const { offsetHeight, clientHeight } = this.textElement;
      const offset = offsetHeight - clientHeight;

      let inner = 0;
      const boxSizing = this._getStyleProp('box-sizing');

      if (boxSizing !== 'border-box') {
        const paddingTop = this._getStyleProp('padding-top');
        const paddingBottom = this._getStyleProp('padding-bottom');
        const borderTop = this._getStyleProp('border-top-width');
        const borderBottom = this._getStyleProp('border-bottom-width');
        inner = paddingTop + paddingBottom + borderTop + borderBottom;
      }

      const { height: prevHeight } = this.textElement.style;

      this.textElement.style.minHeight = 'auto';
      this.textElement.style.height = 'auto';

      const { scrollHeight } = this.textElement;
      const numericNextMinHeight = scrollHeight + offset - inner;
      const nextMinHeight = `${numericNextMinHeight}px`;
      const numericPrevHeight = pxToNumber(prevHeight);

      let nextHeight = prevHeight;

      if (numericPrevHeight != null) {
        nextHeight = this._resizedByUser
          ? `${Math.max(numericNextMinHeight, numericPrevHeight)}px`
          : `${numericPrevHeight}px`;
      }

      this.textElement.style.minHeight = nextMinHeight;
      this.textElement.style.height = nextHeight;
    }
  }

  _handleResize () {
    this._resizedByUser = true;
    this._handleChange();
    this._resizedByUser = false;
  }

  _getStyleProp (str) {
    const elementStyles = window.getComputedStyle(this.textElement);
    const prop = elementStyles.getPropertyValue(str);

    return prop.endsWith('px')
      ? pxToNumber(prop)
      : prop;
  }
};

export default WithAutoHeight;
