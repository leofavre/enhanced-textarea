const onPropChange = (element, propName, { onGet, onSet }) => {
  const proto = Object.getPrototypeOf(element) || {};

  const { get: superGet, set: superSet } =
    Object.getOwnPropertyDescriptor(proto, propName) || {};

  const userProtoAccessors = superGet && superSet;

  const newProps = {
    get (...args) {
      const result = userProtoAccessors
        ? superGet.apply(this, args)
        : this[`_${propName}`];

      onGet && onGet(result);

      return result;
    },
    set (...args) {
      if (userProtoAccessors) {
        superSet.apply(this, args);
      } else {
        this[`_${propName}`] = args[0];
      }

      onSet && onSet(args[0]);
    }
  };

  Object.defineProperty(element, propName, newProps);
};

export default onPropChange;
