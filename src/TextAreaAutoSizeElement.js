import { SHARED_ATTRIBUTES } from './constants.js';
import TextAreaAutoSizeFactory from './TextAreaAutoSizeFactory.js';
import setAttr from './setAttr.js';

const BaseClass = TextAreaAutoSizeFactory(HTMLElement);

const TEMPLATE = document.createElement('template');

TEMPLATE.innerHTML = `
  <style>
    :host {
      display: inline-block;
      padding: 0 !important;
      border: none !important;
    }
    textarea {
      display: block;
      box-sizing: border-box;
      resize: none;
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
    this._reflectToAttribute = this._reflectToAttribute.bind(this);
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    SHARED_ATTRIBUTES.forEach(this._reflectToAttribute);
  }

  _reflectToAttribute (propName) {
    const oldValue = this[propName];

    Object.defineProperty(this, propName, {
      get () {
        return this.getAttribute(propName);
      },
      set (value) {
        setAttr(this, propName, value);
      }
    });

    this[propName] = oldValue;
  }

  attributeChangedCallback (...args) {
    const [attrName, , nextValue] = args;

    if (SHARED_ATTRIBUTES.includes(attrName)) {
      setAttr(this.textElement, attrName, nextValue);
    }

    super.attributeChangedCallback && super.attributeChangedCallback(...args);
  }
}
