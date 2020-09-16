const OBSERVED_ATTRS = ['autoheight', 'rows', 'class'];

export class TextAreaAutoSize extends HTMLTextAreaElement {
  constructor () {
    super();

    const targetEl = this._autoResizeTarget || this;

    this._handleChange = this._handleChange.bind(targetEl);
    this._handleUserResize = this._handleUserResize.bind(targetEl);
    this._handleAutoHeightStart = this._handleAutoHeightStart.bind(targetEl);
    this._handleAutoHeightEnd = this._handleAutoHeightEnd.bind(targetEl);
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

  static get observedAttributes () {
    return [...super.observedAttributes || [], ...OBSERVED_ATTRS];
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

    if (this.autoHeight && OBSERVED_ATTRS.includes(attrName)) {
      this._handleChange();
    }
  }

  _addListeners () {
    this._resizeObserver = new ResizeObserver(this._handleChange);
    this._resizeObserver.observe(this);
    this.addEventListener('input', this._handleChange);
    this.addEventListener('pointerup', this._handleUserResize);
    this.addEventListener('pointerdown', this._handleUserResize);
  }

  _removeListeners () {
    this._resizeObserver.unobserve(this);
    this.removeEventListener('input', this._handleChange);
    this.removeEventListener('pointerup', this._handleUserResize);
    this.removeEventListener('pointerdown', this._handleUserResize);
  }

  _handleAutoHeightStart () {
    this._addListeners();
    this._prevOverflow = this.style.overflow;
    this.style.overflow = 'hidden';
  }

  _handleAutoHeightEnd () {
    this._removeListeners();
    this.style.overflow = this._prevOverflow;
  }

  _handleChange () {
    const offset = this.offsetHeight - this.clientHeight;
    this.style.minHeight = 'auto';

    if (!this._isUserResizing) {
      this.style.minHeight = `${this.scrollHeight + offset}px`;
    }
  }

  _handleUserResize ({ type }) {
    this._isUserResizing = (type === 'pointerdown');

    if (type === 'pointerup') {
      this._handleChange();
    }
  }
}
