const onPropChange = (element, propName, { onGet, onSet }) => {
  const proto = Object.getPrototypeOf(element) || {};

  const { get: superGet, set: superSet } =
    Object.getOwnPropertyDescriptor(proto, propName) || {};

  const newProps = {
    get: function (...args) {
      const result = superGet
        ? superGet.apply(this, args)
        : this[`_${propName}`];

      onGet && onGet(result);

      return result;
    },
    set: function (...args) {
      onSet && onSet(...args);

      if (superSet) {
        superSet.apply(this, args);
        return;
      }

      this[`_${propName}`] = args[0];
    }
  };

  Object.defineProperty(element, propName, newProps);
};

export default onPropChange;
