const setProp = (propName, value) => ([element]) => {
  element[propName] = value;
};

export default setProp;
