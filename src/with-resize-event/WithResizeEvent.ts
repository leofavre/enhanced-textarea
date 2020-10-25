import { CustomElementConstructor } from '../types';

export type WithResizeEventBase = CustomElementConstructor<HTMLTextAreaElement>;
export type HTMLTextAreaElementWithResizeEvent = HTMLTextAreaElement;

export type WithResizeEventDecorator =
  CustomElementConstructor<HTMLTextAreaElementWithResizeEvent>;

function WithResizeEvent (Base: WithResizeEventBase): WithResizeEventDecorator {
  return class extends Base {
    private _preResizeHeight: number;
    private _preResizeWidth: number;

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

    private _handleResizeEventStart () {
      this._handleResizeEventEnd();
      this.addEventListener('pointerdown', this._handlePointer);
      this.addEventListener('pointerup', this._handlePointer);
    }

    private _handleResizeEventEnd () {
      this.removeEventListener('pointerdown', this._handlePointer);
      this.removeEventListener('pointerup', this._handlePointer);
    }

    private _handlePointer (evt?: Event) {
      const { type } = evt || {};
      const { offsetHeight, offsetWidth } = this;

      if (type === 'pointerdown') {
        this._preResizeHeight = offsetHeight;
        this._preResizeWidth = offsetWidth;
        return;
      }

      if (type === 'pointerup') {
        const resizedByUser =
          this._preResizeHeight !== offsetHeight ||
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
