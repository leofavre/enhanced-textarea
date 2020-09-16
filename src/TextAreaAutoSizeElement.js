import TextAreaAutoSizeFactory from './TextAreaAutoSizeFactory.js';

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
  }

  attributeChangedCallback (...args) {
    const [attrName, , nextValue] = args;

    if (attrName === 'rows') {
      this.textElement.setAttribute('rows', nextValue);
    }

    super.attributeChangedCallback && super.attributeChangedCallback(...args);
  }
}
