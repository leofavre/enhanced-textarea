import WithElement from '../hocs/WithElement.js';
import WithAutoHeight from '../hocs/WithAutoHeight.js';
import WithResizeEvent from '../hocs/WithResizeEvent.js';

const EnhancedTextAreaElementFactory = (Base = class {}) =>
  class extends WithElement(WithAutoHeight(WithResizeEvent(Base))) {};

export default EnhancedTextAreaElementFactory;
