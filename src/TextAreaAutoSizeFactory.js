import setAttr from './helpers/setAttr.js';
import resetProperty from './helpers/resetProperty.js';

const OBSERVED_ATTRIBUTES = ['autoheight', 'rows', 'cols', 'class'];
const LAZY_PROPERTIES = ['autoheight', 'value'];

export default BaseClass => class extends BaseClass {
  constructor () {
    super();
    this.textElement = this;

    this._handleChange = this._handleChange.bind(this);
    this._handleAutoHeightStart = this._handleAutoHeightStart.bind(this);
    this._handleAutoHeightEnd = this._handleAutoHeightEnd.bind(this);
  }

  get autoheight () {
    return this.hasAttribute('autoheight');
  }

  set autoheight (value) {
    setAttr.call(this, 'autoheight', value);
  }

  get value () {
    return super.value;
  }

  set value (value) {
    super.value = value;

    if (this.autoheight) {
      this._handleChange();
    }
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

    if (attrName === 'autoheight' && prevValue !== nextValue) {
      if (prevValue == null) {
        this._handleAutoHeightStart();
      } else if (nextValue == null) {
        this._handleAutoHeightEnd();
      }
    }

    if (this.autoheight && OBSERVED_ATTRIBUTES.includes(attrName)) {
      this._handleChange();
    }
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    LAZY_PROPERTIES.forEach(resetProperty.bind(this));
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
    const {
      resize,
      height,
      overflow,
      boxSizing
    } = this.textElement.style;

    this._prevResize = resize;
    this._prevHeight = height;
    this._prevOverflow = overflow;
    this._prevBoxSizing = boxSizing;

    this.textElement.style.resize = 'none';
    this.textElement.style.height = 'auto';
    this.textElement.style.overflow = 'hidden';
    this.textElement.style.boxSizing = 'border-box';
  }

  _handleAutoHeightEnd () {
    this._removeListeners();
    this.textElement.style.resize = this._prevResize;
    this.textElement.style.height = this._prevHeight;
    this.textElement.style.overflow = this._prevOverflow;
    this.textElement.style.boxSizing = this._prevBoxSizing;
  }

  _handleChange () {
    const { offsetHeight, clientHeight } = this.textElement;
    const offset = offsetHeight - clientHeight;
    this.textElement.style.minHeight = 'auto';
    const { scrollHeight } = this.textElement;
    this.textElement.style.minHeight = `${scrollHeight + offset}px`;
  }
};
