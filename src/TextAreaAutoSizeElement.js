import setAttr from './helpers/setAttr.js';
import typeCast from './helpers/typeCast.js';
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

const PROPERTIES = {
  autocomplete: Boolean,
  autofocus: Boolean,
  cols: Number,
  disabled: Boolean,
  maxLength: Number,
  minLength: Number,
  readOnly: Boolean,
  rows: Number
};

const LAZY_PROPERTIES = [
  'value',
  ...Object.keys(PROPERTIES)
];

const OBSERVED_ATTRIBUTES = Object
  .keys(PROPERTIES)
  .map(item => item.toLowerCase());

export default class extends BaseClass {
  constructor () {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(TEMPLATE.content.cloneNode(true));
    this.textElement = this.shadowRoot.querySelector('textarea');
  }

  static get observedAttributes () {
    return [
      ...super.observedAttributes,
      ...OBSERVED_ATTRIBUTES
    ];
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    const self = this;
    const userProperties = Object.getOwnPropertyNames(this);

    const initialUserEntries = LAZY_PROPERTIES
      .filter(propName => userProperties.includes(propName))
      .reduce((result, propName) => ({
        ...result,
        [propName]: this[propName]
      }), {});

    Object.defineProperty(this, 'value', {
      get () {
        return self.textElement.value;
      },
      set (value) {
        self.textElement.value = value;

        if (self.autoheight) {
          self._handleChange();
        }
      }
    });

    Object
      .entries(PROPERTIES)
      .forEach(([propName, type]) => {
        const attrName = propName.toLowerCase();

        Object.defineProperty(this, propName, {
          get () {
            return typeCast.call(self, attrName, type);
          },
          set (value) {
            setAttr.call(self, attrName, value);
          }
        });
      });

    Object
      .entries(initialUserEntries)
      .forEach(([propName, value]) => {
        this[propName] = value;
      });
  }

  attributeChangedCallback (...args) {
    super.attributeChangedCallback && super.attributeChangedCallback(...args);
    const [attrName, prevValue, nextValue] = args;

    if (prevValue !== nextValue && OBSERVED_ATTRIBUTES.includes(attrName)) {
      setAttr.call(this.textElement, attrName, nextValue);
    }
  }
}
