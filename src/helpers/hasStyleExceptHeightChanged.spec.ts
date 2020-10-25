import hasStyleExceptHeightChanged from './hasStyleExceptHeightChanged';

describe('hasStyleExceptHeightChanged', () => {
  it('Returns false if both parameters are null', () => {
    expect(hasStyleExceptHeightChanged(null, null)).toBe(false);
  });

  it('Returns false if the first parameter is null', () => {
    expect(hasStyleExceptHeightChanged(null, 'width: 300px;')).toBe(false);
  });

  it('Returns false if the second parameter is null', () => {
    expect(hasStyleExceptHeightChanged('width: 300px;', null)).toBe(false);
  });

  it('Verifies that style has changed', () => {
    const prevStyle = 'width: 128px; line-height: 2;';
    const nextStyle = 'width: 300px; line-height: 3;';
    const result = hasStyleExceptHeightChanged(prevStyle, nextStyle);
    expect(result).toBe(true);
  });

  it('Verifies that style has not changed', () => {
    const prevStyle = 'width: 350px; overflow: hidden;';
    const nextStyle = 'width: 350px; overflow: hidden;';
    const result = hasStyleExceptHeightChanged(prevStyle, nextStyle);
    expect(result).toBe(false);
  });

  it('Verifies that style has not changed ignoring spaces', () => {
    const prevStyle = 'width: 350px;  overflow:    hidden; ';
    const nextStyle = '   width:   350px;  overflow: hidden;';
    const result = hasStyleExceptHeightChanged(prevStyle, nextStyle);
    expect(result).toBe(false);
  });

  it('Verifies that style has not changed ignoring height', () => {
    const prevStyle = 'height: 250px; width: 350px; overflow: hidden;';
    const nextStyle = 'height: 125px; width: 350px; overflow: hidden;';
    const result = hasStyleExceptHeightChanged(prevStyle, nextStyle);
    expect(result).toBe(false);
  });

  it('Verifies that style has not changed ignoring min-height', () => {
    const prevStyle = 'min-height: 250px; width: 350px; overflow: hidden;';
    const nextStyle = 'min-height: 125px; width: 350px; overflow: hidden;';
    const result = hasStyleExceptHeightChanged(prevStyle, nextStyle);
    expect(result).toBe(false);
  });

  it('Verifies that style has not changed even if properties come in different orders', () => {
    const prevStyle = 'width: 350px; overflow: hidden;';
    const nextStyle = 'overflow: hidden; width: 350px;';
    const result = hasStyleExceptHeightChanged(prevStyle, nextStyle);
    expect(result).toBe(false);
  });

  it('Verifies that style has not changed even if the last property is not followed by a semicolon', () => {
    const prevStyle = 'width: 350px; overflow: hidden;';
    const nextStyle = 'width: 350px; overflow: hidden';
    const result = hasStyleExceptHeightChanged(prevStyle, nextStyle);
    expect(result).toBe(false);
  });

  it('Verifies that style has not changed ignoring height and min-height even with confusing strings', () => {
    const prevStyle = ' min-height:auto;  width:   350px ; overflow: hidden  ;';
    const nextStyle = 'overflow: hidden;width:350px;    height: 100px';
    const result = hasStyleExceptHeightChanged(prevStyle, nextStyle);
    expect(result).toBe(false);
  });
});
