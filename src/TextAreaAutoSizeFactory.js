import setAttr from './helpers/setAttr.js';
import typeCast from './helpers/typeCast.js';
import resetProperty from './helpers/resetProperty.js';
import removeStyleProp from './helpers/removeStyleProp.js';

const omitMinHeight = removeStyleProp('min-height');

export default BaseClass => class extends BaseClass {
  constructor () {
    super();
    this.textElement = this;
    this._handleChange = this._handleChange.bind(this);
  }

  get autoheight () {
    return typeCast(this, 'autoheight', Boolean);
  }

  set autoheight (value) {
    setAttr(this, 'autoheight', value);
  }

  get value () {
    return super.value;
  }

  set value (value) {
    super.value = value;
    this.autoheight && this._handleChange();
  }

  static get observedAttributes () {
    return [
      ...super.observedAttributes || [],
      'autoheight',
      'rows',
      'cols',
      'class',
      'style'
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

      if (this.autoheight) {
        const hasStyleChanged = () =>
          omitMinHeight(prevValue) !== omitMinHeight(nextValue);

        if (!attrName === 'style' || hasStyleChanged()) {
          setTimeout(this._handleChange);
        }
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
    this._prevResize = this.textElement.style.resize;
    this._prevHeight = this.textElement.style.height;
    this._prevOverflow = this.textElement.style.overflow;
    this._prevBoxSizing = this.textElement.style.boxSizing;
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
    this.textElement.style.resize = 'none';
    this.textElement.style.height = 'auto';
    this.textElement.style.overflow = 'hidden';
    this.textElement.style.boxSizing = 'border-box';

    const { scrollHeight } = this.textElement;
    this.textElement.style.minHeight = `${scrollHeight + offset}px`;
  }
};
