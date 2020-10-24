import { WithAutoheight, WithResizeEvent } from './index';

const Enhancer = WithAutoheight(WithResizeEvent(HTMLTextAreaElement));

const args = [
  Enhancer,
  'enhanced-textarea',
  { extends: 'textarea' }
];

window.customElements.define(...args);
