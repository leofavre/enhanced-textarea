const NodeEnvironment = require('jest-environment-node');

class HTMLTextAreaElement {}

class ResizeObserver {
  observe () {}
  unobserve () {}
}

function getComputedStyle () {
  return {
    getPropertyValue () {
      return '';
    }
  };
}

class JestEnvironment extends NodeEnvironment {
  async setup () {
    await super.setup();

    this.global.HTMLTextAreaElement = HTMLTextAreaElement;
    this.global.ResizeObserver = ResizeObserver;
    this.global.getComputedStyle = getComputedStyle;

    this.global.window = {
      HTMLTextAreaElement,
      ResizeObserver,
      getComputedStyle
    };
  }

  async teardown () {
    await super.teardown();
    this.global.window = undefined;
  }
}

module.exports = JestEnvironment;
