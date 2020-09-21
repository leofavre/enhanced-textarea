const NodeEnvironment = require('jest-environment-node');

class JestEnvironment extends NodeEnvironment {
  async setup () {
    await super.setup();
    class HTMLTextAreaElement {}

    class ResizeObserver {
      observe () {}
      unobserve () {}
    }

    this.global.HTMLTextAreaElement = HTMLTextAreaElement;
    this.global.ResizeObserver = ResizeObserver;

    this.global.window = {
      HTMLTextAreaElement,
      ResizeObserver
    };
  }

  async teardown () {
    await super.teardown();
    this.global.window = undefined;
  }
}

module.exports = JestEnvironment;
