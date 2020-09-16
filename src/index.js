const OBSERVED_ATTRS = ['autoheight', 'rows', 'class'];

export class AutomaticallyResizableTextArea extends HTMLTextAreaElement {
  constructor () {
    super();
    this.__handleChange = this.__handleChange.bind(this);
    this.__handleUserResize = this.__handleUserResize.bind(this);
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
        this.__addListeners();
      } else if (nextValue == null) {
        this.__removeListeners();
      }
    }

    if (this.autoHeight && OBSERVED_ATTRS.includes(attrName)) {
      this.__handleChange();
    }
  }

  __addListeners () {
    this.__resizeObserver = new ResizeObserver(this.__handleChange);
    this.__resizeObserver.observe(this);
    this.addEventListener('input', this.__handleChange);
    this.addEventListener('pointerup', this.__handleUserResize);
    this.addEventListener('pointerdown', this.__handleUserResize);
  }

  __removeListeners () {
    this.__resizeObserver.unobserve(this);
    this.removeEventListener('input', this.__handleChange);
    this.removeEventListener('pointerup', this.__handleUserResize);
    this.removeEventListener('pointerdown', this.__handleUserResize);
  }

  __handleChange () {
    const offset = this.offsetHeight - this.clientHeight;
    this.style.minHeight = 'auto';

    if (!this.__isUserResizing) {
      this.style.minHeight = `${this.scrollHeight + offset}px`;
    }
  }

  __handleUserResize ({ type }) {
    this.__isUserResizing = (type === 'pointerdown');

    if (type === 'pointerup') {
      this.__handleChange();
    }
  }
}
