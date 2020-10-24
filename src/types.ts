export type Maybe<T> = T | undefined;

export type PropName = string;

export type AttrValue = string | null;
export type AttrName = string;
export type AttributeChangedCallbackArgs = [AttrName?, AttrValue?, AttrValue?];

export type BasicPrimitive = string | number | boolean;

export type AnyConstrcutor<T> = {
  new (...args: any[]): T;
  prototype: T;
}

export type CustomElementConstructor<T> = AnyConstrcutor<T> & {
  observedAttributes?: Maybe<AttrName[]>;
};

export type HTMLTextAreaElementConstructor =
  CustomElementConstructor<HTMLTextAreaElement>;

declare global {
  interface HTMLElement {
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(...args: AttributeChangedCallbackArgs): void;
  }
}
