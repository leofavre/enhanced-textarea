import { OBSERVED_ATTRIBUTES, LAZY_PROPERTIES } from './constants.js';

export default BaseClass => class extends BaseClass {
  constructor () {
    super();
    this.textElement = this;

    this._handleChange = this._handleChange.bind(this);
    this._handleUserResize = this._handleUserResize.bind(this);
    this._handleAutoHeightStart = this._handleAutoHeightStart.bind(this);
    this._handleAutoHeightEnd = this._handleAutoHeightEnd.bind(this);
    this._makePropertyLazy = this._makePropertyLazy.bind(this);
  }

  get autoheight () {
    return this.hasAttribute('autoheight');
  }

  set autoheight (value) {
    if (value) {
      this.setAttribute('autoheight', '');
    } else {
      this.removeAttribute('autoheight');
    }
  }

  get value () {
    return super.value;
  }

  set value (value) {
    super.value = value;

    if (this !== this.textElement) {
      this.textElement.value = value;
    }

    this._handleChange();
  }

  static get observedAttributes () {
    return [
      ...super.observedAttributes || [],
      ...OBSERVED_ATTRIBUTES
    ];
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    LAZY_PROPERTIES.forEach(this._makePropertyLazy);
  }

  _makePropertyLazy (propName) {
    if (Object.keys(this).includes(propName)) {
      const value = this[propName];
      delete this[propName];
      this[propName] = value;
    }
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

  _addListeners () {
    this._resizeObserver = new ResizeObserver(this._handleChange);
    this._resizeObserver.observe(this.textElement);
    this.textElement.addEventListener('input', this._handleChange);
    this.textElement.addEventListener('pointerup', this._handleUserResize);
    this.textElement.addEventListener('pointerdown', this._handleUserResize);
  }

  _removeListeners () {
    this._resizeObserver.unobserve(this.textElement);
    this.textElement.removeEventListener('input', this._handleChange);
    this.textElement.removeEventListener('pointerup', this._handleUserResize);
    this.textElement.removeEventListener('pointerdown', this._handleUserResize);
  }

  _handleAutoHeightStart () {
    this._addListeners();
    this._prevOverflow = this.textElement.style.overflow;
    this.textElement.style.overflow = 'hidden';
  }

  _handleAutoHeightEnd () {
    this._removeListeners();
    this.textElement.style.overflow = this._prevOverflow;
  }

  _handleChange () {
    const { offsetHeight, clientHeight } = this.textElement;
    const offset = offsetHeight - clientHeight;
    this.textElement.style.minHeight = 'auto';

    if (!this._isUserResizing) {
      const { scrollHeight } = this.textElement;
      this.textElement.style.minHeight = `${scrollHeight + offset}px`;
    }
  }

  _handleUserResize ({ type }) {
    this._isUserResizing = (type === 'pointerdown');

    if (type === 'pointerup') {
      this._handleChange();
    }
  }
};
