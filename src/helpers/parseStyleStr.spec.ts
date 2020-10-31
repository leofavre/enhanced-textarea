import parseStyleStr from './parseStyleStr';

describe('parseStyleStr', () => {
  it('Orders properties', () => {
    const styleStr = 'width: 128px; line-height: 2; padding: 0 1px 1px 0;';
    const result = parseStyleStr(styleStr);
    expect(result).toBe('line-height:2;padding:0 1px 1px 0;width:128px;');
  });

  it('Standardizes spaces', () => {
    const styleStr = '  width:     350px  ;  overflow:hidden ;  ';
    const result = parseStyleStr(styleStr);
    expect(result).toBe('overflow:hidden;width:350px;');
  });

  it('Adds missing semi-collon at the end', () => {
    const styleStr = 'overflow: hidden;width: 350px';
    const result = parseStyleStr(styleStr);
    expect(result).toBe('overflow:hidden;width:350px;');
  });
});
