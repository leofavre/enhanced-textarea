import hasStyleExceptHeightChanged from '../helpers/hasStyleExceptHeightChanged';
import pxToNumber from '../helpers/pxToNumber';
import getCoercedAttr from '../helpers/getCoercedAttr';
import setAttr from '../helpers/setAttr';
import resetProp from '../helpers/resetProp';

import { Constructor } from '../types';

function WithAutoheight<T extends Constructor<HTMLInputElement>> (Base: T): T {
  return class extends Base {
    _resizedByUser = false;

    constructor (...args: any[]) {
      super(...args);
      this._handleChange = this._handleChange.bind(this);
      this._handleResize = this._handleResize.bind(this);
    }

    get autoheight () {
      return getCoercedAttr(this, 'autoheight', Boolean);
    }

    set autoheight (value) {
      setAttr(this, 'autoheight', value);
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
      this._handleAttributeChange(...args);
    }

    connectedCallback () {
      super.connectedCallback && super.connectedCallback();
      resetProp(this, 'autoheight');
    }

    disconnectedCallback () {
      super.disconnectedCallback && super.disconnectedCallback();
      this._handleAutoHeightEnd();
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
      this._resizeObserver = new ResizeObserver(this._handleChange);
      this._resizeObserver.observe(this);
      this.addEventListener('input', this._handleChange);
      this.addEventListener('resize', this._handleResize);
    }

    _handleAutoHeightEnd () {
      this._resizeObserver && this._resizeObserver.unobserve(this);
      this.removeEventListener('input', this._handleChange);
      this.removeEventListener('resize', this._handleResize);
    }

    _handleChange () {
      if (this.hasAttribute('autoheight')) {
        const { offsetHeight, clientHeight } = this;
        const offset = offsetHeight - clientHeight;

        let inner = 0;
        const boxSizing = this._getStyleProp('box-sizing') as string;

        if (boxSizing !== 'border-box') {
          const paddingTop = this._getStyleProp('padding-top') as number;
          const paddingBottom = this._getStyleProp('padding-bottom') as number;
          const borderTop = this._getStyleProp('border-top-width') as number;
          const borderBottom = this._getStyleProp('border-bottom-width') as number;

          inner = paddingTop + paddingBottom + borderTop + borderBottom;
        }

        const { height: prevHeight } = this.style;

        this.style.minHeight = 'auto';
        this.style.height = 'auto';

        const { scrollHeight } = this;
        const numericNextMinHeight = scrollHeight + offset - inner;
        const nextMinHeight = `${numericNextMinHeight}px`;
        const numericPrevHeight = pxToNumber(prevHeight);

        let nextHeight = prevHeight;

        if (numericPrevHeight != null) {
          nextHeight = this._resizedByUser
            ? `${Math.max(numericNextMinHeight, numericPrevHeight)}px`
            : `${numericPrevHeight}px`;
        }

        this.style.minHeight = nextMinHeight;
        this.style.height = nextHeight;
      }
    }

    _handleResize () {
      this._resizedByUser = true;
      this._handleChange();
      this._resizedByUser = false;
    }

    _getStyleProp (str: string) {
      const elementStyles = window.getComputedStyle(this);
      const prop = elementStyles.getPropertyValue(str);

      return prop.endsWith('px')
        ? pxToNumber(prop)
        : prop;
    }
  };
}

export default WithAutoheight;
