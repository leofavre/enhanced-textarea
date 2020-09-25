import EnhancedTextAreaScriptFactory from './factory.js';

const EnhancedTextAreaScript = EnhancedTextAreaScriptFactory();

export const enhance = (domElement) =>
  new EnhancedTextAreaScript(domElement);

export default EnhancedTextAreaScript;
