import EnhancedTextAreaBuiltIn from '../src/built-in/index.js';

customElements.define(
  'enhanced-textarea',
  EnhancedTextAreaBuiltIn,
  { extends: 'textarea' }
);
