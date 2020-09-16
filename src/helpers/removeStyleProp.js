export default propName => (styleStr = '') =>
  styleStr.replace(new RegExp(`${propName}:.*?;`, 'g'), '');
