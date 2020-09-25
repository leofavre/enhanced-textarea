import WithBuiltIn from '../hocs/WithBuiltIn.js';
import WithAutoHeight from '../hocs/WithAutoHeight.js';
import WithResizeEvent from '../hocs/WithResizeEvent.js';

const EnhancedTextAreaBuiltInFactory = (Base = class {}) =>
  class extends WithBuiltIn(WithAutoHeight(WithResizeEvent(Base))) {};

export default EnhancedTextAreaBuiltInFactory;
