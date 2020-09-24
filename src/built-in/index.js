import EnhancedTextAreaBuiltInFactory from './factory.js';

export const defineElement = (name = 'enhanced-textarea') => {
  customElements.define(
    name,
    EnhancedTextAreaBuiltIn,
    { extends: 'textarea' }
  );
};

const EnhancedTextAreaBuiltIn =
  EnhancedTextAreaBuiltInFactory(HTMLTextAreaElement);

export default EnhancedTextAreaBuiltIn;
