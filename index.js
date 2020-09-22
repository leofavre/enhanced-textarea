import EnhancedTextAreaBuiltIn from '../src/EnhancedTextAreaBuiltIn.js';

customElements.define(
  'enhanced-textarea',
  EnhancedTextAreaBuiltIn,
  { extends: 'textarea' }
);
