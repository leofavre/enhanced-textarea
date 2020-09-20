export default str => {
  const parsedValue = Number(str.replace(/px$/, ''));
  return Number.isNaN(parsedValue) ? undefined : parsedValue;
};
