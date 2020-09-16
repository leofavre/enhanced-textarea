export const SHARED_ATTRIBUTES = [
  'rows',
  'cols'
];

export const PARENT_ATTRIBUTES = [
  'autoheight',
  'class'
];

export const OBSERVED_ATTRIBUTES = [
  ...PARENT_ATTRIBUTES,
  ...SHARED_ATTRIBUTES
];

export const LAZY_PROPERTIES = [
  'autoHeight',
  'autoheight',
  'value',
  ...SHARED_ATTRIBUTES
];
