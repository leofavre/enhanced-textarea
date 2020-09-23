import WithAutoHeight from '../hocs/WithAutoHeight.js';
import WithResizeEvent from '../hocs/WithResizeEvent.js';

const EnhancedTextAreaBuiltInFactory = (Base = class {}) =>
  class extends WithAutoHeight(WithResizeEvent(Base)) {};

export default EnhancedTextAreaBuiltInFactory;
