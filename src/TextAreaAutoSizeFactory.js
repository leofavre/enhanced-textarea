import setAttr from './helpers/setAttr.js';
import getCoercedAttr from './helpers/getCoercedAttr.js';
import resetProperty from './helpers/resetProperty.js';
import ignoreMinHeight from './helpers/ignoreMinHeight.js';

const OBSERVED_ATTRIBUTES = ['autoheight', 'rows', 'cols', 'class', 'style'];

export default BaseClass => class extends BaseClass {
  constructor () {
    super();
    this.textElement = this;
    this._handleChange = this._handleChange.bind(this);
    this._handleUserResize = this._handleUserResize.bind(this);
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
      ...OBSERVED_ATTRIBUTES
    ];
  }

  attributeChangedCallback (...args) {
    super.attributeChangedCallback && super.attributeChangedCallback(...args);
    const [attrName, prevValue, nextValue] = args;

    if (prevValue !== nextValue) {
      if (attrName === 'autoheight') {
        if (prevValue == null) {
          this._handleAutoHeightStart();
        } else if (nextValue == null) {
          this._handleAutoHeightEnd();
        }
      }

      const hasStyleChanged = () =>
        ignoreMinHeight(prevValue) !== ignoreMinHeight(nextValue);

      if (!attrName === 'style' || hasStyleChanged()) {
        setTimeout(this._handleChange);
      }
    }
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    resetProperty(this, 'autoheight');
  }

  _addListeners () {
    this._resizeObserver = new ResizeObserver(this._handleChange);
    this._resizeObserver.observe(this.textElement);
    this.textElement.addEventListener('input', this._handleChange);
    this.addEventListener('pointerup', this._handleUserResize);
    this.addEventListener('pointerdown', this._handleUserResize);
  }

  _removeListeners () {
    this._resizeObserver.unobserve(this.textElement);
    this.textElement.removeEventListener('input', this._handleChange);
    this.removeEventListener('pointerup', this._handleUserResize);
    this.removeEventListener('pointerdown', this._handleUserResize);
  }

  _handleAutoHeightStart () {
    this._addListeners();
    this._prevOverflow = this.textElement.style.overflow;
    this._prevBoxSizing = this.textElement.style.boxSizing;
  }

  _handleAutoHeightEnd () {
    this._removeListeners();
    this.textElement.style.overflow = this._prevOverflow;
    this.textElement.style.boxSizing = this._prevBoxSizing;
  }

  _handleChange () {
    if (this.autoheight) {
      const { offsetHeight, clientHeight } = this.textElement;
      const offset = offsetHeight - clientHeight;

      this.textElement.style.minHeight = 'auto';
      this.textElement.style.overflow = 'hidden';
      this.textElement.style.boxSizing = 'border-box';

      if (!this._isUserResizing) {
        const { scrollHeight } = this.textElement;
        this.textElement.style.minHeight = `${scrollHeight + offset}px`;
      }
    }
  }

  _handleUserResize ({ type }) {
    this._isUserResizing = (type === 'pointerdown');

    if (this._isUserResizing) {
      const { minHeight } = this.textElement.style;
      this.textElement.style.height = minHeight;
      this.textElement.style.minHeight = 'auto';
    } else {
      const { height } = this.textElement.style;
      this.textElement.style.minHeight = height;
      this.textElement.style.height = 'auto';
    }
  }
};
