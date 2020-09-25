import getCoercedAttr from '../helpers/getCoercedAttr.js';
import setAttr from '../helpers/setAttr.js';

const WithScript = (Base = class {}) => class extends Base {
  get baseElement () {
    return this._customBaseElement;
  }

  constructor (customBaseElement) {
    super();
    this._customBaseElement = customBaseElement;
    this._handleMutation = this._handleMutation.bind(this);

    this._handleResizeEventStart();

    const mutationObserver = new MutationObserver(this._handleMutation);
    const observedAttributes = this.constructor.observedAttributes || [];

    mutationObserver.observe(this.baseElement, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: observedAttributes
    });

    observedAttributes.forEach(attributeName => {
      this._handleMutation([{
        attributeName,
        oldValue: null
      }]);
    });

    const self = this;
    const proto = Object.getPrototypeOf(this.baseElement);

    const { get: superGetValue, set: superSetValue } =
      Object.getOwnPropertyDescriptor(proto, 'value');

    const prevAutoHeight = this.baseElement.autoheight ||
      getCoercedAttr(this.baseElement, 'autoheight', Boolean);

    Object.defineProperties(this.baseElement, {
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
          return superGetValue.apply(this, args);
        },
        set (...args) {
          superSetValue.apply(this, args);
          self._handleChange();
        }
      }
    });

    this.baseElement.autoheight = prevAutoHeight;
  }

  _handleMutation (records) {
    records.forEach(({ attributeName, oldValue }) => {
      const nextValue = this.baseElement.getAttribute(attributeName);
      this._handleAttributeChange(attributeName, oldValue, nextValue);
    });
  }
};

export default WithScript;
