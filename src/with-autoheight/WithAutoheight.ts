import hasStyleExceptHeightChanged from '../helpers/hasStyleExceptHeightChanged';
import pxToNumber from '../helpers/pxToNumber';
import getCoercedAttr from '../helpers/getCoercedAttr';
import setAttr from '../helpers/setAttr';
import resetProp from '../helpers/resetProp';

import { AttributeChangedCallbackArgs, CustomElementConstructor } from '../types';

export type WithAutoheightBase = CustomElementConstructor<HTMLTextAreaElement>;

export type HTMLTextAreaElementWithAutoheight = HTMLTextAreaElement & {
  autoheight: boolean;
}

export type WithAutoheightDecorator =
  CustomElementConstructor<HTMLTextAreaElementWithAutoheight>;

function WithAutoheight (Base: WithAutoheightBase): WithAutoheightDecorator {
  return class extends Base {
    private _resizedByUser: boolean;
    private _resizeObserver: ResizeObserver;

    constructor (...args: any[]) {
      super(...args);
      this._handleChange = this._handleChange.bind(this);
      this._handleResize = this._handleResize.bind(this);
    }

    get autoheight () {
      return getCoercedAttr(this, 'autoheight', Boolean) as boolean;
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

    attributeChangedCallback (...args: AttributeChangedCallbackArgs) {
      super.attributeChangedCallback && super.attributeChangedCallback(...args);
      this._handleAttributeChange(...args);
    }

    connectedCallback () {
      super.connectedCallback && super.connectedCallback();
      resetProp(this, 'autoheight');
      this._handleAutoheightStart();
    }

    disconnectedCallback () {
      super.disconnectedCallback && super.disconnectedCallback();
      this._handleAutoheightEnd();
    }

    private _handleAttributeChange (...args: AttributeChangedCallbackArgs) {
      const [attrName, oldValue, nextValue] = args;

      if (oldValue !== nextValue) {
        if (attrName === 'autoheight') {
          if (oldValue == null) {
            this._handleAutoheightStart();
          } else if (nextValue == null) {
            this._handleAutoheightEnd();
          }
        }

        if (attrName !== 'style' ||
        hasStyleExceptHeightChanged(oldValue, nextValue)) {
          this._handleChange();
        }
      }
    }

    private _handleAutoheightStart () {
      this._handleAutoheightEnd();
      this._resizeObserver = new ResizeObserver(this._handleChange);
      this._resizeObserver.observe(this);
      this.addEventListener('input', this._handleChange);
      this.addEventListener('resize', this._handleResize);
    }

    private _handleAutoheightEnd () {
      this._resizeObserver && this._resizeObserver.unobserve(this);
      this.removeEventListener('input', this._handleChange);
      this.removeEventListener('resize', this._handleResize);
    }

    private _handleChange () {
      if (this.hasAttribute('autoheight')) {
        const { offsetHeight, clientHeight } = this;
        const offset = offsetHeight - clientHeight;

        let inner = 0;
        const boxSizing = this._getStyleProp('box-sizing') as string;

        if (boxSizing !== 'border-box') {
          inner = [
            this._getStyleProp('padding-top') as number,
            this._getStyleProp('padding-bottom') as number,
            this._getStyleProp('border-top-width') as number,
            this._getStyleProp('border-bottom-width') as number
          ].reduce((sum, item) => sum + item, 0);
        }

        const { height: pastHeight } = this.style;

        this.style.minHeight = 'auto';
        this.style.height = 'auto';

        const { scrollHeight } = this;
        const numericNextMinHeight = scrollHeight + offset - inner;
        const nextMinHeight = `${numericNextMinHeight}px`;
        const numericPrevHeight = pxToNumber(pastHeight);

        let nextHeight = pastHeight;

        if (numericPrevHeight != null) {
          nextHeight = this._resizedByUser
            ? `${Math.max(numericNextMinHeight, numericPrevHeight)}px`
            : `${numericPrevHeight}px`;
        }

        this.style.minHeight = nextMinHeight;
        this.style.height = nextHeight;
      }
    }

    private _handleResize () {
      this._resizedByUser = true;
      this._handleChange();
      this._resizedByUser = false;
    }

    private _getStyleProp (str: string) {
      const elementStyles = window.getComputedStyle(this);
      const prop = elementStyles.getPropertyValue(str);

      return prop.endsWith('px')
        ? pxToNumber(prop)
        : prop;
    }
  };
}

export default WithAutoheight;
