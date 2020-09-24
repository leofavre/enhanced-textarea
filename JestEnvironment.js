const NodeEnvironment = require('jest-environment-node');

class HTMLTextAreaElement {}

class CustomEvent {}

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

class jestEnvironment extends NodeEnvironment {
  async setup () {
    await super.setup();

    this.global.HTMLTextAreaElement = HTMLTextAreaElement;
    this.global.CustomEvent = CustomEvent;
    this.global.ResizeObserver = ResizeObserver;
    this.global.getComputedStyle = getComputedStyle;

    this.global.window = {
      HTMLTextAreaElement,
      CustomEvent,
      ResizeObserver,
      getComputedStyle
    };
  }

  async teardown () {
    await super.teardown();
    this.global.HTMLTextAreaElement = undefined;
    this.global.CustomEvent = undefined;
    this.global.ResizeObserver = undefined;
    this.global.getComputedStyle = undefined;
    this.global.window = undefined;
  }
}

module.exports = jestEnvironment;
