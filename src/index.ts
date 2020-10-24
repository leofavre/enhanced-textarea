import WithAutoheight from './with-autoheight/WithAutoheight';
import WithResizeEvent from './with-resize-event/WithResizeEvent';

@WithAutoheight
@WithResizeEvent
class EnhancedTextArea extends HTMLTextAreaElement {}

export default EnhancedTextArea;

export {
  WithAutoheight,
  WithResizeEvent
};
