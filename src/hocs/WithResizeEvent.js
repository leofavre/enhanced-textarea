const WithResizeEvent = (Base = class {}) => class extends Base {
  constructor () {
    super();
    this._handlePointer = this._handlePointer.bind(this);
  }

  get baseElement () {
    return this;
  }

  _handleResizeEventStart () {
    this.baseElement.addEventListener('pointerdown', this._handlePointer);
    this.baseElement.addEventListener('pointerup', this._handlePointer);
  }

  _handleResizeEventEnd () {
    this.baseElement.removeEventListener('pointerdown', this._handlePointer);
    this.baseElement.removeEventListener('pointerup', this._handlePointer);
  }

  _handlePointer ({ type } = {}) {
    const { offsetHeight, offsetWidth } = this.baseElement;

    if (type === 'pointerdown') {
      this._preResizeHeight = offsetHeight;
      this._preResizeWidth = offsetWidth;
      return;
    }

    if (type === 'pointerup') {
      const resizedByUser = this._preResizeHeight !== offsetHeight ||
        this._preResizeWidth !== offsetWidth;

      if (resizedByUser) {
        const event = new CustomEvent('userresize', {
          bubbles: true,
          cancelable: false,
          composed: true
        });

        this.baseElement.dispatchEvent(event);
      }
    }
  }
};

export default WithResizeEvent;
