import EnhancedTextArea from './index';
import { action } from '@storybook/addon-actions';

// This code will run only once

if (!window.customElements.get('enhanced-textarea')) {
  window.customElements.define(
    'enhanced-textarea',
    EnhancedTextArea,
    { extends: 'textarea' }
  );
}

const element = document.createElement(
  'textarea',
  { is: 'enhanced-textarea' }
);

element.setAttribute('is', 'enhanced-textarea');
element.addEventListener('resize', action('Resized by the user'));

export default {
  title: 'Enhanced Text Area',
  argTypes: {
    autoheight: {
      name: 'autoheight',
      description: 'Controls if the component should automatically grow or ' +
        'shrink according to the amount of text',
      table: {
        defaultValue: {
          summary: 'false'
        }
      },
      control: {
        type: 'boolean'
      }
    }
  }
};

// This code will run everytime controls are changed

export const Autoheight = ({ autoheight }) => {
  element.autoheight = autoheight;
  return element;
};

Autoheight.args = {
  autoheight: true
};
