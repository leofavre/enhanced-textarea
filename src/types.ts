export type AttrValue = string | null;
export type AttrName = string;
export type AttributeChangedCallbackArgs = [AttrName?, AttrValue?, AttrValue?];
export type BasicPrimitive = string | number | boolean;
export type PropName = string;

export type Constrcutor<T> = {
  new (...args: any[]): T;
  prototype: T;
}

export type CustomElementConstructor<T> = Constrcutor<T> & {
  observedAttributes?: AttrName[];
};

export type Maybe<T> = T | undefined;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

declare global {
  interface HTMLElement {
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(...args: AttributeChangedCallbackArgs): void;
  }
}
