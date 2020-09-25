import getCoercedAttr from '../helpers/getCoercedAttr.js';
import setAttr from '../helpers/setAttr.js';
import resetProp from '../helpers/resetProp.js';

const WithBuiltIn = (Base = class {}) => class extends Base {
  get textElement () {
    return this;
  }

  get autoheight () {
    return getCoercedAttr(this.textElement, 'autoheight', Boolean);
  }

  set autoheight (value) {
    setAttr(this.textElement, 'autoheight', value);
  }

  get value () {
    return super.value;
  }

  set value (value) {
    super.value = value;
    this._handleChange();
  }

  attributeChangedCallback (...args) {
    super.attributeChangedCallback && super.attributeChangedCallback(...args);
    this._handleAttributeChange(...args);
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    resetProp(this, 'autoheight');
    this._handleResizeEventStart();
  }

  disconnectedCallback () {
    super.disconnectedCallback && super.disconnectedCallback();
    this._handleAutoHeightEnd();
    this._handleResizeEventEnd();
  }
};

export default WithBuiltIn;
