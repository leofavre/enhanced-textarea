export class AutomaticallyResizableTextArea extends HTMLTextAreaElement {
  get autoresize () {
    return this.autoResize;
  }

  set autoresize (value) {
    this.autoResize = value;
  }

  get autoResize () {
    return this.hasAttribute('autoresize');
  }

  set autoResize (value) {
    if (value) {
      this.setAttribute('autoresize', '');
    } else {
      this.removeAttribute('autoresize');
    }
  }
}
