import setAttr from './setAttr.js';
import typeCast from './typeCast.js';

export default function reflectToAttribute (attrName, { type = String } = {}) {
  Object.defineProperty(this, attrName, {
    get () {
      return typeCast.call(this, attrName, type);
    },
    set (value) {
      setAttr.call(this, attrName, value);
    }
  });
}
