import WithScript from '../hocs/WithScript.js';
import WithAutoHeight from '../hocs/WithAutoHeight.js';
import WithResizeEvent from '../hocs/WithResizeEvent.js';

const EnhancedTextAreaScriptFactory = (Base = class {}) =>
  class extends WithScript(WithAutoHeight(WithResizeEvent(Base))) {};

export default EnhancedTextAreaScriptFactory;
