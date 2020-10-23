interface HTMLElement {
  connectedCallback(): void;
  disconnectedCallback(): void;
  attributeChangedCallback(
    attrName?: string,
    oldValue?: string | null,
    nextValue?: string | null
  ): void;
}
