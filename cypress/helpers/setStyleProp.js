const setStyleProp = (propName, value) => ([element]) => {
  element.style[propName] = value;
};

export default setStyleProp;
