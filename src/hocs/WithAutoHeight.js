import getCoercedAttr from '../helpers/getCoercedAttr.js';
import setAttr from '../helpers/setAttr.js';
import resetProp from '../helpers/resetProp.js';
import hasStyleExceptHeightChanged from '../helpers/hasStyleExceptHeightChanged.js';
import pxToNumber from '../helpers/pxToNumber.js';

const WithAutoHeight = (Base = class {}) => class extends Base {
  constructor () {
    super();
    this._handleChange = this._handleChange.bind(this);
    this._handleResize = this._handleResize.bind(this);
  }

  get textElement () {
    return this;
  }

  get autoheight () {
    return getCoercedAttr(this.textElement, 'autoheight', Boolean);
  }

  set autoheight (value) {
    setAttr(this.textElement, 'autoheight', value);
  }

  get value () {
    return super.value;
  }

  set value (value) {
    super.value = value;
    this._handleChange();
  }

  static get observedAttributes () {
    return [
      ...super.observedAttributes || [],
      ...['autoheight', 'rows', 'cols', 'class', 'style']
    ];
  }

  attributeChangedCallback (...args) {
    super.attributeChangedCallback && super.attributeChangedCallback(...args);
    const [attrName, oldValue, nextValue] = args;

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

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    resetProp(this.textElement, 'autoheight');
  }

  _handleAutoHeightStart () {
    this._resizeObserver = new ResizeObserver(this._handleChange);
    this._resizeObserver.observe(this.textElement);
    this.textElement.addEventListener('input', this._handleChange);
    this.textElement.addEventListener('userresize', this._handleResize);
  }

  _handleAutoHeightEnd () {
    this._resizeObserver.unobserve(this.textElement);
    this.textElement.removeEventListener('input', this._handleChange);
    this.textElement.removeEventListener('userresize', this._handleResize);
  }

  _handleChange () {
    if (this.autoheight) {
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
