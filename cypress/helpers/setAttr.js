import setAttrHelper from '../../src/helpers/setAttr.js';

const setAttr = (propName, value) => ([element]) => {
  setAttrHelper(element, propName, value);
};

export default setAttr;
