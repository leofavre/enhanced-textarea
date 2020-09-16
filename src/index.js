const OBSERVED_ATTRS = ['autoheight', 'rows', 'class', 'style'];

export class AutomaticallyResizableTextArea extends HTMLTextAreaElement {
  constructor () {
    super();
    this.__handleChange = this.__handleChange.bind(this);
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
    const [attrName] = args;

    if (OBSERVED_ATTRS.includes[attrName]) {
      this.__handleChange();
    }
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    this.__resizeObserver = new ResizeObserver(this.__handleChange);
    this.__resizeObserver.observe(this);
    this.addEventListener('input', this.__handleChange);
  }

  disconnectedCallback () {
    super.disconnectedCallback && super.disconnectedCallback();
    this.__resizeObserver.unobserve(this);
    this.removeEventListener('input', this.__handleChange);
  }

  __handleChange () {
    if (this.autoHeight) {
      const offset = this.offsetHeight - this.clientHeight;
      this.style.minHeight = 'auto';
      this.style.minHeight = this.scrollHeight + offset + 'px';
    }
  }
}
