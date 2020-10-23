import { Constructor } from '../types';

function WithResizeEvent<T extends Constructor<HTMLInputElement>> (Base: T): T {
  return class extends Base {
    _preResizeHeight: number;
    _preResizeWidth: number;

    constructor (...args: any[]) {
      super(...args);
      this._handlePointer = this._handlePointer.bind(this);
    }

    connectedCallback () {
      super.connectedCallback && super.connectedCallback();
      this._handleResizeEventStart();
    }

    disconnectedCallback () {
      super.disconnectedCallback && super.disconnectedCallback();
      this._handleResizeEventEnd();
    }

    _handleResizeEventStart () {
      this.addEventListener('pointerdown', this._handlePointer);
      this.addEventListener('pointerup', this._handlePointer);
    }

    _handleResizeEventEnd () {
      this.removeEventListener('pointerdown', this._handlePointer);
      this.removeEventListener('pointerup', this._handlePointer);
    }

    _handlePointer (evt: Event) {
      const { type } = evt;
      const { offsetHeight, offsetWidth } = this;

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
}

export default WithResizeEvent;
