import { OBSERVED_ATTRIBUTES } from './constants.js';

export default BaseClass => class extends BaseClass {
  constructor () {
    super();
    this.textElement = this;
    this._handleChange = this._handleChange.bind(this);
    this._handleUserResize = this._handleUserResize.bind(this);
    this._handleAutoHeightStart = this._handleAutoHeightStart.bind(this);
    this._handleAutoHeightEnd = this._handleAutoHeightEnd.bind(this);
  }

  get autoheight () {
    return this.autoHeight;
  }

  set autoheight (value) {
    this.autoHeight = value;
  }

  get autoHeight () {
    return this.hasAttribute('autoheight');
  }

  set autoHeight (value) {
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

    if (this.autoHeight && OBSERVED_ATTRIBUTES.includes(attrName)) {
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
