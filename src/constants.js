import arrayToLowerCase from './helpers/arrayToLowerCase.js';

export const NATIVE_REFLECTED_PROPERTIES = [
  'autofocus',
  'cols',
  'dirName',
  'disabled',
  'form',
  'minLength',
  'maxLength',
  'placeholder',
  'readOnly',
  'required',
  'rows',
  'wrap'
];

export const NATIVE_NON_REFLECTED_PROPERTIES = [
  'defaultValue',
  'selectionDirection',
  'selectionStart',
  'selectionEnd',
  'value'
];

export const CUSTOM_PROPERTIES = [
  'autoheight'
];

export const NATIVE_REFLECTED_ATTRIBUTES =
  arrayToLowerCase(NATIVE_REFLECTED_PROPERTIES);

export const NATIVE_NON_REFLECTED_ATTRIBUTES =
  arrayToLowerCase(NATIVE_NON_REFLECTED_PROPERTIES);

export const CUSTOM_ATTRIBTUES = arrayToLowerCase(CUSTOM_PROPERTIES);

export const OBSERVED_ATTRIBUTES = [
  ...CUSTOM_ATTRIBTUES,
  ...NATIVE_REFLECTED_ATTRIBUTES,
  'class'
];

export const LAZY_PROPERTIES = [
  ...CUSTOM_PROPERTIES,
  ...NATIVE_NON_REFLECTED_PROPERTIES,
  ...NATIVE_REFLECTED_PROPERTIES
];
