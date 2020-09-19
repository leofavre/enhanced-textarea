import setAttr from './helpers/setAttr.js';
import getCoercedAttr from './helpers/getCoercedAttr.js';
import resetProperty from './helpers/resetProperty.js';
import hasStyleExceptHeightChanged from './helpers/hasStyleExceptHeightChanged.js';

const OBSERVED_ATTRIBUTES = ['autoheight', 'rows', 'cols', 'class', 'style'];

export default BaseClass => class extends BaseClass {
  constructor () {
    super();
    this.textElement = this;
    this._handleChange = this._handleChange.bind(this);
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

      if (!attrName === 'style' ||
        hasStyleExceptHeightChanged(prevValue, nextValue)) {
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
  }

  _removeListeners () {
    this._resizeObserver.unobserve(this.textElement);
    this.textElement.removeEventListener('input', this._handleChange);
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

      this.textElement.style.overflow = 'hidden';
      this.textElement.style.boxSizing = 'border-box';

      const { height: prevHeight } = this.textElement.style;

      this.textElement.style.minHeight = 'auto';
      this.textElement.style.height = 'auto';

      const { scrollHeight } = this.textElement;

      this.textElement.style.height = prevHeight;
      this.textElement.style.minHeight = `${scrollHeight + offset}px`;
    }
  }
};
