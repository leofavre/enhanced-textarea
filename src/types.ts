type AttrName = string;
type AttrValue = string | null;

export type AttributeChangedCallbackParams = [AttrName, AttrValue, AttrValue];

export type Constructor<T> = {
  new (...args: any[]): T;
  prototype: T;
}

export type HTMLTextAreaElementConstructor =
  Constructor<HTMLTextAreaElement> & { observedAttributes: string[] };

declare global {
  interface HTMLElement {
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(...args: AttributeChangedCallbackParams): void;
  }
}
