const WithResizeEvent = (Base = class {}) => class extends Base {
  constructor () {
    super();
    this._handlePointer = this._handlePointer.bind(this);
  }

  get textElement () {
    return this;
  }

  connectedCallback () {
    super.connectedCallback && super.connectedCallback();
    this.textElement.addEventListener('pointerdown', this._handlePointer);
    this.textElement.addEventListener('pointerup', this._handlePointer);
  }

  disconnectedCallback () {
    super.disconnectedCallback && super.disconnectedCallback();
    this.textElement.removeEventListener('pointerdown', this._handlePointer);
    this.textElement.removeEventListener('pointerup', this._handlePointer);
  }

  _handlePointer ({ type } = {}) {
    const { offsetHeight, offsetWidth } = this.textElement;

    if (type === 'pointerdown') {
      this._preResizeHeight = offsetHeight;
      this._preResizeWidth = offsetWidth;
      return;
    }

    if (type === 'pointerup') {
      const resizedByUser = this._preResizeHeight !== offsetHeight ||
        this._preResizeWidth !== offsetWidth;

      if (resizedByUser) {
        const event = new CustomEvent('resize', {
          bubbles: true,
          cancelable: false,
          composed: true
        });

        this.dispatchEvent(event);
      }
    }
  }
};

export default WithResizeEvent;
