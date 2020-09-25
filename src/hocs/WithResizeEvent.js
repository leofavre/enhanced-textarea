const WithResizeEvent = (Base = class {}) => class extends Base {
  get textElement () {
    return this;
  }

  _handleResizeEventStart () {
    const pointerHandler = this._handlePointer.bind(this);
    this.textElement.addEventListener('pointerdown', pointerHandler);
    this.textElement.addEventListener('pointerup', pointerHandler);
  }

  _handleResizeEventEnd () {
    const pointerHandler = this._handlePointer.bind(this);
    this.textElement.removeEventListener('pointerdown', pointerHandler);
    this.textElement.removeEventListener('pointerup', pointerHandler);
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
        const event = new CustomEvent('userresize', {
          bubbles: true,
          cancelable: false,
          composed: true
        });

        this.textElement.dispatchEvent(event);
      }
    }
  }
};

export default WithResizeEvent;
