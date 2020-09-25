import getCoercedAttr from '../helpers/getCoercedAttr.js';
import setAttr from '../helpers/setAttr.js';

const WithScript = (Base = class {}) => class extends Base {
  constructor (customTextElement) {
    super();
    this._customTextElement = customTextElement;
    this._handleMutation = this._handleMutation.bind(this);

    this._handleResizeEventStart();

    const mutationObserver = new MutationObserver(this._handleMutation);
    const observedAttributes = this.constructor.observedAttributes || [];

    mutationObserver.observe(this.textElement, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: this.constructor.observedAttributes
    });

    observedAttributes.forEach(attributeName => {
      this._handleMutation([{
        attributeName,
        oldValue: null
      }]);
    });

    const self = this;
    const proto = Object.getPrototypeOf(this.textElement);

    const { get: superGet, set: superSet } =
      Object.getOwnPropertyDescriptor(proto, 'value');

    Object.defineProperties(this.textElement, {
      autoheight: {
        get () {
          return getCoercedAttr(this, 'autoheight', Boolean);
        },
        set (value) {
          setAttr(this, 'autoheight', value);
        }
      },
      value: {
        get (...args) {
          return superGet.apply(this, args);
        },
        set (...args) {
          superSet.apply(this, args);
          self._handleChange();
        }
      }
    });
  }

  get textElement () {
    return this._customTextElement;
  }

  _handleMutation (records) {
    records.forEach(({ attributeName, oldValue }) => {
      const nextValue = this.textElement.getAttribute(attributeName);
      this._handleAttributeChange(attributeName, oldValue, nextValue);
    });
  }
};

export default WithScript;
