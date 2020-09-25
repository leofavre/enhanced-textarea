import EnhancedTextAreaElementFactory from './factory.js';

export const defineElement = (name = 'enhanced-textarea') => {
  customElements.define(name, EnhancedTextAreaElement);
};

const EnhancedTextAreaElement =
  EnhancedTextAreaElementFactory(HTMLElement);

export default EnhancedTextAreaElement;
