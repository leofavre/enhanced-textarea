const WithResizeEvent = (Base = class {}) => class extends Base {
  get baseElement () {
    return this;
  }

  _handleResizeEventStart () {
    const pointerHandler = this._handlePointer.bind(this);
    this.baseElement.addEventListener('pointerdown', pointerHandler);
    this.baseElement.addEventListener('pointerup', pointerHandler);
  }

  _handleResizeEventEnd () {
    const pointerHandler = this._handlePointer.bind(this);
    this.baseElement.removeEventListener('pointerdown', pointerHandler);
    this.baseElement.removeEventListener('pointerup', pointerHandler);
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
