const WithScript = (Base = class {}) => class extends Base {
  constructor (customTextElement) {
    super(customTextElement);
    this._customTextElement = customTextElement;
    this.connectedCallback();

    this._handleAttrChange = this._handleAttrChange.bind(this);
    const mutationObserver = new MutationObserver(this._handleAttrChange);
    const observedAttributes = this.constructor.observedAttributes || [];

    mutationObserver.observe(this.textElement, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: this.constructor.observedAttributes
    });

    observedAttributes.forEach(attributeName => {
      this._handleAttrChange([{
        attributeName,
        oldValue: null
      }]);
    });
  }

  get textElement () {
    return this._customTextElement;
  }

  _handleAttrChange (records) {
    records.forEach(record => {
      const { attributeName, oldValue } = record;
      const nextValue = this.textElement.getAttribute(attributeName);
      const args = [attributeName, oldValue, nextValue];
      super.attributeChangedCallback && super.attributeChangedCallback(...args);
    });
  }
};

export default WithScript;
