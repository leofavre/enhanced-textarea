export type Possibly<T> = T | undefined;

export type PropName = string;

export type AttrValue = string | null;
export type AttrName = string;
export type AttributeChangedCallbackArguments = [AttrName, AttrValue, AttrValue];

export type BasicPrimitive = string | number | boolean;

type Constructor<T> = {
  new (...args: any[]): T;
  observedAttributes: Possibly<AttrName[]>;
};

export type HTMLTextAreaElementConstructor = Constructor<HTMLTextAreaElement>;

declare global {
  interface HTMLElement {
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(...args: AttributeChangedCallbackArguments): void;
  }
}
