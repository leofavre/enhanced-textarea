import getCoercedAttr from '../helpers/getCoercedAttr.js';
import setAttr from '../helpers/setAttr.js';
import resetProp from '../helpers/resetProp.js';

const WithElement = (Base = class {}) => class extends Base {
  constructor () {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(this.constructor.template.content.cloneNode(true));
    this._baseElement = shadowRoot.querySelector('textarea');
  }

  static get template () {
    const template = document.createElement('template');

    template.innerHTML = `
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

    return template;
  }

  get baseElement () {
    return this._baseElement;
  }

  get autoheight () {
    return getCoercedAttr(this.baseElement, 'autoheight', Boolean);
  }

  set autoheight (value) {
    setAttr(this.baseElement, 'autoheight', value);
  }

  get value () {
    return this.baseElement.value;
  }

  set value (value) {
    this.baseElement.value = value;
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

export default WithElement;
