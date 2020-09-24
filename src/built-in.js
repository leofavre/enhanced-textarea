import EnhancedTextAreaBuiltIn from './built-in/index.js';

export const defineElement = (name = 'enhanced-textarea') => {
  customElements.define(
    name,
    EnhancedTextAreaBuiltIn,
    { extends: 'textarea' }
  );
};

export default EnhancedTextAreaBuiltIn;
