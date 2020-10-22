const removeStyleProp = (propName: string) => {
  return (styleStr?: string): string | undefined =>
    styleStr != null && styleStr.replace
      ? styleStr
        .replace(new RegExp(`(^| |;)${propName}:.*?(;|$)`, 'g'), '$1')
        .replace(/  +/g, ' ')
        .trim()
      : styleStr || undefined;
};

export default removeStyleProp;
