import setAttr from './helpers/setAttr.js';
import getCoercedAttr from './helpers/getCoercedAttr.js';
import resetProperty from './helpers/resetProperty.js';
import TextAreaAutoSizeFactory from './TextAreaAutoSizeFactory.js';

const BaseClass = TextAreaAutoSizeFactory(HTMLElement);

const TEMPLATE = document.createElement('template');

TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-block;
      padding: 0 !important;
      border: none !important;
      height: auto !important;
    }

    textarea {
      display: block;
      width: 100%;

      resize: none;
      height: auto;
      overflow: hidden;
      box-sizing: border-box;

      font: inherit;
      line-height: inherit;
    }
  </style>
  <textarea part="textarea"></textarea>
`;

export default class extends BaseClass {
  constructor () {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this.textElement = this.shadowRoot.querySelector('textarea');
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    [
      'rows',
      'cols',
      'disabled',
      'minLength',
      'maxLength'
    ].forEach(resetProperty.bind(this));
  }

  get value () {
    return super.value;
  }

  set value (value) {
    super.value = value;
    this.textElement.value = value;
  }

  get rows () {
    return getCoercedAttr(this, 'rows', String);
  }

  set rows (value) {
    setAttr(this, 'rows', value);
    this.textElement.rows = value;
  }

  get cols () {
    return getCoercedAttr(this, 'cols', String);
  }

  set cols (value) {
    setAttr(this, 'cols', value);
    this.textElement.cols = value;
  }

  get disabled () {
    return getCoercedAttr(this, 'disabled', Boolean);
  }

  set disabled (value) {
    setAttr(this, 'disabled', value);
    this.textElement.disabled = value;
  }

  get minLength () {
    return getCoercedAttr(this, 'minlength', Number);
  }

  set minLength (value) {
    setAttr(this, 'minlength', value);
    this.textElement.minLength = value;
  }

  get maxLength () {
    return getCoercedAttr(this, 'maxlength', Number);
  }

  set maxLength (value) {
    setAttr(this, 'maxlength', value);
    this.textElement.maxLength = value;
  }
}
